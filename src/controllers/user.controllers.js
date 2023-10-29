const catchError = require('../utils/catchError');
const User = require('../models/User');

const getAll = catchError(async(req, res) => {
    // Operaciones...
    const users = await User.findAll();
    return res.json(users)
});

const create = catchError(async(req, res) => {
  const { first_name, last_name, email, password, birthday } = req.body
  const user = await User.create({
    first_name, last_name, email, password, birthday
  });
  return res.status(201).json(user);
});

const remove = catchError(async(req, res) => {
  const { id } = req.params
  await User.destroy({ where: {id: id} });
  return res.sendStatus(204)
});

const getOne = catchError(async(req, res) => {
  const { id } = req.params
  const user = await User.findByPk(id)
  return res.json(user)
});

const update = catchError(async(req, res) => {
  const { id } = req.params
  const { first_name, last_name, email, password, birthday } = req.body
  const [updatedCount, updatedUsers] = await User.update(
    { first_name, last_name, email, password, birthday },
    { where: { id: id }, returning: true }
  );

  // Check if at least the row is updated
  if (updatedCount > 0 && updatedUsers.length > 0) {
    const updatedUser = updatedUsers[0];
    return res.json(updatedUser);
  } else {
    // Error when user doesn't exist
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
});

module.exports = {
    getAll,
    create,
    remove,
    getOne,
    update,
}