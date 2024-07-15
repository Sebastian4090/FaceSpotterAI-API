const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not Found");
      }
    })
    .catch((err) => res.status(400).json("Error getting"));
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet, customicon } = req.body.formInput;
  db("users")
    .where({ id })
    .update({ name, age, pet, customicon })
    .then((resp) => {
      if (res) {
        res.json("success");
      } else {
        res.status(400).json("Unable to update");
      }
    })
    .catch((err) => console.log(err));
};

export { handleProfileGet, handleProfileUpdate };
