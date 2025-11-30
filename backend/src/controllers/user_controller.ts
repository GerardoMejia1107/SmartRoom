import { Request, Response } from "express";
import { UserService } from "../services/user_service";
import { User } from "../models/user_model";
import mqtt_client from "../mqtt/mqtt_client";
import { json } from "stream/consumers";

export class UserController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: "Error fetching users" });
    }
  }

  static async getAllRFIDs(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find({ active: true }).select("rfid_uid -_id");
      const allowedIDs = users.map((u) => u.rfid_uid);

      res.json({ allowed: allowedIDs });
    } catch (error) {
      console.error("Error getting refid's:", error);
      res.status(500).json({ error: "Error fetching allowed users" });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Error fetching user" });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await UserService.create(req.body);

      let users = await User.find({ active: true }).select("rfid_uid -_id");
      let allowed = users.map((u) => u.rfid_uid);

      mqtt_client.publish("rfid/allowed/update", JSON.stringify(allowed), {retain: true});
      console.log("[MQTT] Publicando allowed:", allowed);

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Error creating user" });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await UserService.update(req.params.id, req.body);
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ error: "Error updating user" });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const deletedUser = await UserService.delete(req.params.id);
      if (!deletedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ message: "User deleted", user: deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(400).json({ error: "Error deleting user" });
    }
  }
}
