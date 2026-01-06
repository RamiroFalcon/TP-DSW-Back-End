import bcrypt from 'bcrypt';
import { pool } from '../src/database/connection.js';

/**
 * Script para actualizar contraseñas en texto plano a bcrypt hash
 * 
 * USUARIOS EXISTENTES EN LA BD:
 * - cliente / cliente123
 * - admin / admin123
 * - cliente2 / cliente321
 * - martina / marti123
 */

const usuarios = [
  { username: 'cliente', password: 'cliente123' },
  { username: 'admin', password: 'admin123' },
  { username: 'cliente2', password: 'cliente321' },
  { username: 'martina', password: 'marti123' },
];

async function actualizarPasswords() {
  console.log('🔐 Iniciando actualización de contraseñas...\n');

  for (const usuario of usuarios) {
    try {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(usuario.password, 10);

      // Actualizar en la BD
      await pool.query(
        'UPDATE usuario SET password = ? WHERE username = ?',
        [hashedPassword, usuario.username]
      );

      console.log(`✅ ${usuario.username}: ${usuario.password} → ${hashedPassword.substring(0, 20)}...`);
    } catch (error) {
      console.error(`❌ Error actualizando ${usuario.username}:`, error);
    }
  }

  console.log('\n🎉 Actualización completada!');
  console.log('\n📝 Ahora puedes hacer login con:');
  console.log('   - username: cliente, password: cliente123');
  console.log('   - username: admin, password: admin123');
  console.log('   - username: cliente2, password: cliente321');
  console.log('   - username: martina, password: marti123');

  process.exit(0);
}

actualizarPasswords().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
