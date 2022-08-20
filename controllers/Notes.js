import Notes from "../models/NoteModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getNotes = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Notes.findAll({
                attributes:['uuid','name','price'],
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Notes.findAll({
                attributes:['uuid','name','price'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getNoteById = async(req, res) =>{
    try {
        const note = await Notes.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!note) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Notes.findOne({
                attributes:['uuid','name','price'],
                where:{
                    id: note.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Notes.findOne({
                attributes:['uuid','name','price'],
                where:{
                    [Op.and]:[{id: note.id}, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createNote = async(req, res) =>{
    const {name, price} = req.body;
    try {
        await note.create({
            name: name,
            price: price,
            userId: req.userId
        });
        res.status(201).json({msg: "note Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateNote = async(req, res) =>{
    try {
        const note = await note.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!note) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, price} = req.body;
        if(req.role === "admin"){
            await note.update({name, price},{
                where:{
                    id: note.id
                }
            });
        }else{
            if(req.userId !== note.userId) return res.status(403).json({msg: "Akses terlarang"});
            await note.update({name, price},{
                where:{
                    [Op.and]:[{id: note.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "note updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteNote = async(req, res) =>{
    try {
        const note = await note.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!note) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, price} = req.body;
        if(req.role === "admin"){
            await note.destroy({
                where:{
                    id: note.id
                }
            });
        }else{
            if(req.userId !== note.userId) return res.status(403).json({msg: "Akses terlarang"});
            await note.destroy({
                where:{
                    [Op.and]:[{id: note.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "note deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}