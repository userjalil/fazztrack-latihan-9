
const { user } = require('../models')


const findAllUsers = async (req, res) => {
    try {
        const data = await user.findAll()

        const result = {
            status: 'oke',
            data: data
        }
        res.json(result)

    } catch (error) {
        console.log(error, '<< Error find all Users')
    }
};

const getUsersById = async (req, res) => {

    try {
        const { id } = req.params
        const data = await user.findByPk(id)

        if (data === null) {
            return res.status(404).json({
                status: 'failed',
                message: `data User with ${id} not found`,
            })
        }

        res.json({
            status: 'ok',
            data: data
        })

    } catch (error) {
        console.log(error, "<< error find Users by id")
    }
}

const createNewUsers = async (req, res) => {

    try {
        const { firstname, alamat } = req.body
        const newUser = await user.create({ firstname: firstname, alamat: alamat })

        res.status(201).json({
            status: 'ok',
            data: {
                id: newUser.id,
                firstname: newUser.firstname,
                alamat: newUser.alamat,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }

        })
    } catch (error) {
        console.log(error, "<< error create new Users ")
    }

}

const updateUsers = async (req, res) => {

    try {
        //mendapatkan req.params, bedasarkan data User id
        const { id } = req.params
        //mendapatkan req.body, firstname, alamat
        const { firstname, alamat } = req.body
        const User = await user.findByPk(id)

        if (!User) {
            return res.status(404).json({
                status: 'failed',
                message: `data User with ${id} is not exist`
            })

        }

        //update data Users
        User.firstname = firstname
        User.alamat = alamat

        //save datanya
        User.save()

        //return respone
        res.json({
            status: 'ok',
            data: {
                id: User.id,
                firstname: User.firstname,
                alamat: User.alamat,
                createdAt: User.createdAt,
                updatedAt: User.updatedAt
            }
        })

    } catch (error) {
        console.log(error, "<< error update new Users ")
    }

}

const deleteUsers = async (req, res) => {
    try {
        //mendapatkan req.params, bedasarkan data User id
        const { id } = req.params

        const User = await user.findByPk(id)

        if (!User) {
            return res.status(404).json({
                status: 'failed',
                message: `data User with ${id} is not exist`
            })

        }
        //delete data Users
        User.destroy()

        //return respone
        res.json({
            status: 'ok',
            message: `success delete User with ${id}`

        })

    } catch (error) {
        console.log(error, "<< error update new Users ")
    }

}

module.exports = { findAllUsers, getUsersById, createNewUsers, updateUsers, deleteUsers };
