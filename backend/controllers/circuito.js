const { Circuito } = require("../models/db_models");

// 1. Creacion del circuito --V
exports.createCircuito = async (req, res) => {
  try {
    const circuito = await Circuito.create(req.body);
    res.status(201).json(circuito);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Obtener todos los circuitos --V
exports.getAllCircuito = async (req, res) => {
  try {
    const circuitos = await Circuito.findAll();
    res.json(circuitos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 3. Obtener el circuito por id --V
exports.getCircuitoByid = async (req, res) => {
  try {
    const circuito = await Circuito.findByPk(req.params.id);
    if (circuito) {
      res.json(circuito);
    } else {
      res.status(404).json({ error: "Circuito no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 4. actualizar circuito --V
exports.updateCircuito = async (req, res) => {
  try {
    const [updated] = await Circuito.update(req.body, {
      where: { id_circuito: req.params.id },
    });
    if (updated) {
      const updatedCircuito = await Circuito.findByPk(req.params.id);
      res.json(updatedCircuito);
    } else {
      res.status(404).json({ error: "Circuito no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. eliminar circuito --V
exports.deleteCircuito = async (req, res) => {
  try {
    const deleted = await Circuito.destroy({
      where: { id_circuito: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Circuito no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
