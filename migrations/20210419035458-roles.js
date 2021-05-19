module.exports = {
  async up(db, client) {
    const roles = [
      {
        name: 'admin',
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        name: 'user',
        createdAt : new Date(),
        updatedAt : new Date(),
      }
    ]
    await db.collection('roles').insertMany(roles);
  },

  async down(db, client) {
    await db.collection('roles').deleteMany({})
  }
};
