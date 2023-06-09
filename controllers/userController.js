const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

exports.registrasi = (data) => 
  new Promise((resolve, reject) => {

    userModel.findOne({email: data.email})
      .then( async (user) => {
        if(user) {
          reject({
            status: false,
            msg: "Email sudah terdaftar, silahkan gunakan email lain",
          })
        } else {
          const saltRounds = 10;
          const hash = await bcrypt.hash(data.password, saltRounds);
          data.password = hash;

          userModel.create(data)
            .then(() => {
              resolve({
                status: true,
                msg: "Berhasil registrasi",
              });
            }).catch((err) => {
              reject({
                status: false,
                msg: "Terjadi kesalahan pada server",
              })
            })
        }
      })
  })

exports.login = (data) =>
  new Promise((resolve, reject) => {
    userModel.findOne({ userName: data.userName })
      .then( async (user) => {
        if (user) {
          const isValid = await bcrypt.compare(data.password, user.password);
          if( isValid ) {
            resolve({
              status: true,
              msg: "selamat anda berhasil login",
              data: user,
            });
          } else {
            reject({
              status: false,
              msg: "maaf password anda salah"
            });
          }
        } else {
          reject({
            status: false,
            msg: "Username anda tidak terdaftar"
          })
        }
      })
      .catch((err) => {
        reject({
          status: false,
          msg: "Terjadi kesalahan pada server"
        })
      })
  })