const bcrypt = require('bcrypt');

async function verifyPassword() {
  const myPassword = 'admin 123 .202';
  const hash = '$2b$10$BKnfsWR/s8lnJgEa16xa4.g34iImtPGQMWqhqhLH4owolaGFNA62e';
  const isMatch = await bcrypt.compare(myPassword, hash);

  console.log(isMatch);
}

verifyPassword();



