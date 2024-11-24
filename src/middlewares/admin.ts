export default function (req: any, res: any, next: any) {

  // Execute after authorization
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send("Access denied, not admin");
  }

  // Continue to the next middleware or route handler
  next();
}
