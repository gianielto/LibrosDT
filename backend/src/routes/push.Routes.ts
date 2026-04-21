import { Router, Request, Response } from "express";
import webpush from "web-push";
import prisma from "../prisma"; // ajusta el path según tu proyecto

const router = Router();

// Configuramos web-push con tus VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

// Ruta para guardar la subscription de un usuario
// El frontend la llama cuando el usuario acepta notificaciones
router.post("/subscribe", async (req: Request, res: Response) => {
  const { subscription, userId } = req.body;

  try {
    // Guardamos la subscription en la DB
    // upsert: si ya existe para ese usuario, la actualiza
    await prisma.pushSubscription.create({
      data: { userId, subscription: JSON.stringify(subscription) },
    });
    // await prisma.pushSubscription.upsert({
    //   where: { userId },
    //   update: {
    //     subscription: JSON.stringify(subscription),
    //   },
    //   create: {
    //     userId,
    //     subscription: JSON.stringify(subscription),
    //   },
    // });
    res.status(201).json({ message: "Suscripción guardada" });
  } catch (error) {
    res.status(500).json({ error: "Error guardando suscripción" });
  }
});

// Ruta para enviar una notificación a un usuario específico
// La usarías internamente, por ejemplo cuando llega un pedido nuevo
router.post("/notify/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { title, body } = req.body;
  console.log("🔥 HIT /notify/:userId");
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  try {
    const record = await prisma.pushSubscription.findMany({
      where: { userId: Number(userId) },
    });

    if (!record || record.length === 0) {
      res.status(404).json({ error: "Usuario sin suscripción" });
      return;
    }

    const subscription = JSON.parse(record[0].subscription);
    const payload = JSON.stringify({ title, body });

    await webpush.sendNotification(subscription, payload);
    res.json({ message: "Notificación enviada" });
  } catch (error) {
    res.status(500).json({ error: "Error enviando notificación" });
  }
});

export default router;
