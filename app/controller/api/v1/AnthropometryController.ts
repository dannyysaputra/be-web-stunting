import { Request, Response } from "express";
import { AnthropometryService } from "../../../services/AnthropometryService";
import { AnthropometryType } from "../../../models/AnthropometryModel";

const anthropometryService = new AnthropometryService();

export class AnthropometryController {
    public static async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name, measurement_date, birth_date, gender, 
                weight, height, head_circumference, arm_circumference }: AnthropometryType = req.body;
            const userId = req.user?.id;

            if (!name || !measurement_date || !birth_date || !gender || 
                !weight || !height || !head_circumference || !arm_circumference) {
                    return res.status(400).json({
                        status: "Failed",
                        message: "Please provide a valid input"
                    });
            }

            const data = await anthropometryService.createData({
                name,
                measurement_date,
                birth_date,
                gender,
                weight,
                height,
                head_circumference,
                arm_circumference,
                user_id: userId,
            })

            return res.status(201).json({
                status: "Success",
                message: "Anthropometry data was successfully created",
                data: data
            })
        } catch (error) {
            console.error("Internal Error", error);
            return res.status(500).json({
                status: "Failed",
                message: "Internal server error",
                error: error
            })
        }
    }

    public static async getAnthropometries(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;

            const datas = await anthropometryService.findDataByUserId(userId);
            
            return res.status(200).json({
                status: "Success",
                message: "Anthropometry data was successfully retrieved",
                data: datas
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "Failed",
                message: "Internal Server Error",
                error: error
            })
        }
    }

    public static async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const dataId = parseInt(id);

        const { name, measurement_date, birth_date, gender, 
            weight, height, head_circumference, arm_circumference }: AnthropometryType = req.body;
        const userId = req.user?.id;
        
        try {
            const isExist = await anthropometryService.findDataById(dataId);

            if (!isExist) {
                return res.status(404).json({ status: "Failed", message: "Anthropometry data not found" })
            }

            const data = await anthropometryService.updateData(dataId, {
                name,
                measurement_date,
                birth_date,
                gender,
                weight,
                height,
                head_circumference,
                arm_circumference,
                user_id: userId
            })

            return res.status(201).json({
                status: 'Success',
                message: "Anthropometry data updated successfully",
                data: data
            })
        } catch (error) {
            console.error("Internal server error: ", error);
            return res.status(500).json({
                status: "Failed",
                message: "Internal server error",
                error: error
            })
        }
    }

    public static async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const dataId = parseInt(id);

        try {
            const isExist = await anthropometryService.findDataById(dataId);

            if (!isExist) {
                return res.status(404).json({
                    status: "Failed",
                    message: "Not found",
                })
            }

            const isDeleted = await anthropometryService.deleteData(dataId);

            // failed to delete
            if (isDeleted === 0) {
                return res.status(500).json({ status: "Failed", message: "Internal server error" })
            }

            return res.status(201).json({
                status: "Success",
                message: "Data successfully deleted"
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "Failed", message: "Internal server error" })
        }
    }
}