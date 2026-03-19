import crypto from "crypto";
import jwt from 'jsonwebtoken';
import redis from '../caching/cache.js'

export async function createSession(id) {
    const sessionId = crypto.randomBytes(32).toString("hex")

    const sessionToken = jwt.sign({
        sessionId
    }, process.env.SESSION_TOKEN_SECRET, { expiresIn: '7d' })

    const accessToken = jwt.sign({
        id,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15min" })

    const refreshToken = jwt.sign({
        id,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

    await redis.set(sessionId, JSON.stringify({
        accessToken,
        refreshToken
    }), 'EX', 7 * 24 * 60 * 60)


    return sessionToken
}

export async function verifyAuth(req, res, next) {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({
            message: "Session Expired! Login Again"
        });
    }

    let decodedSession;
    try {
        decodedSession = jwt.verify(sessionId, process.env.SESSION_TOKEN_SECRET);
    } catch {
        return res.status(401).json({
            message: "Invalid Session"
        });
    }

    const sessionRaw = await redis.get(decodedSession.sessionId);

    if (!sessionRaw) {
        return res.status(401).json({
            message: "Session Expired"
        });
    }

    const session = JSON.parse(sessionRaw);

    try {
        const decoded = jwt.verify(
            session.accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.user = decoded;
        return next();

    } catch (err) {

        // Refresh token
        try {
            const decodedRefresh = jwt.verify(
                session.refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );

            // Generate new access token
            const newAccessToken = jwt.sign(
                { id: decodedRefresh.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            // Update Redis
            session.accessToken = newAccessToken;
            await redis.set(
                decodedSession.sessionId,
                JSON.stringify(session),
                'EX', 7 * 24 * 60 * 60
            );

            req.user = { id: decodedRefresh.id };

            return next();

        } catch {
            await redis.del(decodedSession.sessionId);
            res.clearCookie("sessionId");
            
            return res.status(401).json({
                message: "Session Expired! Login Again"
            });
        }
    }
}