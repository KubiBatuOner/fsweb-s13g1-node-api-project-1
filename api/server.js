// SUNUCUYU BU DOSYAYA KURUN

const express = require("express");
const User = require("./users/model");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Kubi Batu Öner");
});

server.post("/api/users", (req, res) => {
  let user = req.body;
  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
  } else {
    User.insert(user)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
      });
  }
});

server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
    });
});

server.get("/api/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
    });
});

server.delete("/api/users/:id", async (req, res) => {
  try {
    let deleteUser = await User.findById(req.params.id);
    if (!deleteUser) {
      res
        .status(404)
        .json({ message: "Belirtilen ID li kullanıcı bulunamadı" });
    } else {
      await User.remove(req.params.id);
      res.status(200).json(deleteUser);
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinemedi" });
  }
});

server.put("/api/users/:id", async (req, res) => {
  try {
    let updateUser = await User.findById(req.params.id);
    if (!updateUser) {
      res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    } else {
      if (!req.body.name || !req.body.bio) {
        res
          .status(400)
          .json({ message: "Lütfen kullanıcı için name ve bio sağlayın" });
      } else {
        let updatedUser = await User.update(req.params.id, req.body);
        res.status(200).json(updatedUser);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi" });
  }
});

module.exports = server; // SERVERINIZI EXPORT EDİN {}
