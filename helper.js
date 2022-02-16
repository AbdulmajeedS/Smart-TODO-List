const emailExists = async (email, db) => {
  try {
    const response = await db.query('SELECT * FROM users WHERE email = $1 ;', [email])
    let data = response.rows
    if (data.length === 0) {
      return false
    }
    return data[0]
  } catch (error) {
    console.log(error)
    return false
  };
};

  module.exports = { emailExists }
