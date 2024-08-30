import { Request, Response } from "express";
import { AnthropometryService } from "../../../services/AnthropometryService";
import { AnthropometryResultService } from "../../../services/AnthropometryResultService";
import { AnthropometryType } from "../../../models/AnthropometryModel";

const anthropometryService = new AnthropometryService();
const anthropometryResultService = new AnthropometryResultService();

type CategoryCounts = {
    [key: string]: number;
    'Gizi Buruk': number;
    'Gizi Kurang': number;
    'Gizi Baik': number;
    'Gizi Lebih': number;
};

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

            // Calculate AnthropometryResult based on the newly created entry
            const measurementDate = new Date(measurement_date);
            const birthDate = new Date(birth_date);

            if (isNaN(measurementDate.getTime()) || isNaN(birthDate.getTime())) {
                throw new Error("Invalid date format");
            }

            // Convert Date objects to milliseconds
            const ageInMilliseconds = measurementDate.getTime() - birthDate.getTime();
            const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

            const bb_u = weight / ageInYears;
            const tb_u = height / ageInYears;
            const bb_tb = weight / height;
            const imt_u = weight / (height * height);
            const lk_u = head_circumference / ageInYears;
            const lla_u = arm_circumference / ageInYears;

            // Create AnthropometryResult using the anthropometry ID
            await anthropometryResultService.createData({
                anthropometry_id: data.id,
                bb_u,
                tb_u,
                bb_tb,
                imt_u,
                lk_u,
                lla_u
            });

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

    public static async anthropometryResultById(req: Request, res: Response): Promise<Response> {
        const fs = require('fs').promises;
        const path = require('path');

        try {
            const { id } = req.params;
            const dataId = parseInt(id);

            const data = await anthropometryResultService.findDataById(dataId);

            if (!data) {
                return res.status(404).json({
                    status: "Failed",
                    message: "Data not found"
                });
            }

            const anthropometryData = await anthropometryService.findDataById(data.anthropometry_id);

            if (!anthropometryData) {
                return res.status(404).json({
                    status: "Failed",
                    message: "Anthropometry data not found"
                });
            }

            // Calculate age
            const measurementDate = new Date(anthropometryData.measurement_date);
            const birthDate = new Date(anthropometryData.birth_date);
            const ageInMilliseconds = measurementDate.getTime() - birthDate.getTime();
            const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
            const ageInMonths = Math.round(ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44));

            const gender = anthropometryData.gender === "male" ? 'male' : 'female';

            const fileBbU = `database/datas/${gender}/data-bb-u.json`;
            const fileTbU = `database/datas/${gender}/data-tb-u.json`;
            const fileImtU = `database/datas/${gender}/data-imt-u.json`;

            const fileBbUPath = path.join(fileBbU);
            const fileTbUPath = path.join(fileTbU);
            const fileImtUPath = path.join(fileImtU);

            const dataBbuJson = await fs.readFile(fileBbUPath, 'utf8');
            const jsonBbuData = JSON.parse(dataBbuJson);
            
            const dataTbuJson = await fs.readFile(fileTbUPath, 'utf8');
            const jsonTbuData = JSON.parse(dataTbuJson);

            const dataImtUJson = await fs.readFile(fileImtUPath, 'utf8');
            const jsonImtuData = JSON.parse(dataImtUJson);

            const dataBbU = jsonBbuData.filter((item: { umur_bulan: number }) => {
                return item.umur_bulan == ageInMonths;
            });
            
            const dataTbU = jsonTbuData.filter((item: { umur_bulan: number }) => {
                return item.umur_bulan == ageInMonths;
            });

            const dataImtU = jsonImtuData.filter((item: { umur_bulan: number }) => {
                return item.umur_bulan == ageInMonths;
            });

            const zScore = data.bb_u - dataBbU[0].median;
            console.log(zScore);

            // Define category boundaries
            const minus2SD = dataBbU.minus_2_sd;
            const minus1SD = dataBbU.minus_1_sd;
            const plus1SD = dataBbU.plus_1_sd;

            // Determine the category
            let category: string;

            if (zScore <= minus2SD) {
                category = 'Gizi Buruk'; // Malnutrition
            } else if (zScore <= minus1SD) {
                category = 'Gizi Kurang'; // Underweight
            } else if (zScore <= plus1SD) {
                category = 'Gizi Baik'; // Normal Weight
            } else {
                category = 'Gizi Lebih'; // Overweight
            }

            // Initialize category counts
            const categoryCounts: CategoryCounts = {
                'Gizi Buruk': 0,
                'Gizi Kurang': 0,
                'Gizi Baik': 0,
                'Gizi Lebih': 0
            };

            // Update category count
            categoryCounts[category] += 1;

            // Calculate percentages for pie chart
            const total = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
            const pieChartData = {
                'gizi_buruk': (categoryCounts['Gizi Buruk'] / total) * 100,
                'gizi_kurang': (categoryCounts['Gizi Kurang'] / total) * 100,
                'gizi_baik': (categoryCounts['Gizi Baik'] / total) * 100,
                'gizi_lebih': (categoryCounts['Gizi Lebih'] / total) * 100
            };
            
            return res.status(200).json({
                status: "Success",
                message: "Data successfully retrieved",
                data: {
                    name: anthropometryData.name,
                    weight: Math.round(anthropometryData.weight),
                    height: Math.round(anthropometryData.height),
                    age: Math.round(ageInYears), // Format age to 2 decimal places
                    bb_u: data.bb_u,
                    tb_u: data.tb_u,
                    bb_tb: data.bb_tb,
                    imt_u: data.imt_u,
                    lk_u: data.lk_u,
                    lla_u: data.lla_u,
                    data_bb_u: dataBbU[0],
                    data_tb_u: dataTbU[0],
                    data_imt_u: dataImtU[0],
                    data_gizi: pieChartData
                }
            });

        } catch (error) {
            console.error("Internal Error", error);
            return res.status(500).json({
                status: "Failed",
                message: "Internal server error",
                error: error
            });
        }
    }

}