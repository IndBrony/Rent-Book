const modelBooks = require('../models/books')
const responses = require('../responses')
const cloudinary = require('../configs/cloudinaryConfig')
const multer = require('../middlewares/multer')

module.exports = {
  insertBook: (req, res) => {
    const image = req.file
    if(image){
      const file = multer.dataUri(req).content

      return cloudinary.uploader.upload(file)
        .then(result => {
          const data = {
            title: req.body.title,
            description: req.body.description,
            image: result.url,
            date_released: req.body.date_released,
            genre_id: req.body.genre_id,
            availability: req.body.availability,
            created_at: new Date(),
            Updated_at: new Date()
          }
          console.log(result.url);
          modelBooks.insertBook(data)
            .then(result => {
              data.id = result.insertId
              return responses.dataManipulationResponse(res, 201, 'Success inserting data', data)
            })
            .catch(err => {
              console.error(err)
              return responses.dataManipulationResponse(res, 500, 'Failed to insert data', err)
            })
        })
        .catch(err => responses.dataManipulationResponse(res, 500, 'Failed to insert data', err))
    }
  },
  getAllBook: (req, res) => {
    const keyword = req.query.search
    const sort = req.query.sortby
    const availability = req.query.availability
    const page = req.query.page || 1
    const limit = req.query.limit || 12
    const start = (Number(page) - 1) * limit

    modelBooks.getAllBook(keyword, sort, availability, start, limit)
      .then(result => {
        if (result.length !== 0) return responses.getDataResponse(res, 200, result, result.length, page)
        else return responses.getDataResponse(res, 404, null, null, null, 'Book not found')
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  },
  getOneBook: (req, res) => {
    const id = req.params.id
    modelBooks.getOneBook(id)
      .then(result => {
        if (result.length !== 0) return responses.getDataResponse(res, 200, result, result.length)
        else return responses.getDataResponse(res, 404, null, null, null, 'Book not found')
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  },
  getTotalBooks: (req, res) => {
    modelBooks.getTotalBooks()
      .then(result => {
        if (result.length !== 0) return responses.getDataResponse(res, 200, result, result.length)
        else return responses.getDataResponse(res, 404, null, null, null, 'Data not found')
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  },
  getBookYears: (req, res) => {
    modelBooks.getBookYears()
      .then(result => {
        if (result.length !== 0) return responses.getDataResponse(res, 200, result, result.length)
        else return responses.getDataResponse(res, 404, null, null, null, 'Books not found')
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  },
  getBookGenres: (req, res) => {
    modelBooks.getBookGenres()
      .then(result => {
        if (result.length !== 0) return responses.getDataResponse(res, 200, result, result.length)
        else return responses.getDataResponse(res, 404, null, null, null, 'Books not found')
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  },
  getBookByYear: (req, res) => {
    modelBooks.getBookByYear(req.params.year)
      .then(result => {
        if (result.length !== 0) return responses.getDataResponse(res, 200, result, result.length)
        else return responses.getDataResponse(res, 404, null, null, null, 'Books not found')
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  },
  getBookByGenre: (req, res) => {
    modelBooks.getBookByGenre(req.params.genre)
      .then(result => {
        if (result.length !== 0) return responses.getDataResponse(res, 200, result, result.length)
        else return responses.getDataResponse(res, 404, null, null, null, 'Books not found')
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  },
  getNewestBooks: (req, res) => {
    modelBooks.getNewestBooks()
      .then(result => {
        if (result.length !== 0) return responses.getDataResponse(res, 200, result, result.length)
        else return responses.getDataResponse(res, 404, null, null, null, 'Books not found')
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  },
  updateBook: (req, res) => {
    const id = req.params.id
    const data = {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      date_released: req.body.date_released,
      genre_id: req.body.genre_id,
      Updated_at: new Date()
    }
    const image = req.file
    if (image){
      const file = multer.dataUri(req).content
      cloudinary.uploader.upload(file).then(uploadResult=>{
        data.image = uploadResult.url
        modelBooks.updateBook(id, data)
          .then(result => {
            data.id = id
            if (result.affectedRows !== 0) 
              return modelBooks.getOneBook(id)
            else 
              return responses.dataManipulationResponse(res, 400, 'Failed to update', data)
          })
          .then(result=>{
            console.log(result)
            if (result.length !== 0) responses.dataManipulationResponse(res, 200, 'Success updating data', result)
            else return responses.dataManipulationResponse(res, 400, 'please refresh', data)
          })
          .catch(err => {
            console.error(err)
            return responses.getDataResponse(res, 500, err)
          })
      })
    }else{
      console.log("tak ada image", data)
      modelBooks.updateBook(id, data)
        .then(result => {
          data.id = id
          if (result.affectedRows !== 0) 
            return modelBooks.getOneBook(id)
          else 
            return responses.dataManipulationResponse(res, 400, 'Failed to update', data)
        })
        .then(result=>{
          console.log(result)
          if (result.length !== 0) responses.dataManipulationResponse(res, 200, 'Success updating data', result)
          else return responses.dataManipulationResponse(res, 400, 'please refresh', data)
        })
        .catch(err => {
          console.error(err)
          return responses.getDataResponse(res, 500, err)
        })
    }
  },
  confirmBook:(req, res) => {
    modelBooks.updateBook(req.params.id, {availability:1})
      .then(result => {
        if (result.length !== 0) responses.dataManipulationResponse(res, 200, 'Book Confirmed', result)
        else return responses.dataManipulationResponse(res, 400, 'please refresh', data)
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  },
  deleteBook: (req, res) => {
    const id = req.params.id

    modelBooks.deleteBook(id)
      .then(result => {
        result.id = id
        if (result.affectedRows !== 0) return responses.dataManipulationResponse(res, 200, 'Success deleting data', result)
        else return responses.dataManipulationResponse(res, 400, 'Failed to delete', result)
      })
      .catch(err => {
        console.error(err)
        return responses.getDataResponse(res, 500, err)
      })
  }
}
