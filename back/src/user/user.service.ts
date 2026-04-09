import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

/**
 * Servicio de usuario: contiene la lógica de negocio para gestionar usuarios.
 * Se comunica con la base de datos usando el repositorio de User (TypeORM).
 */
@Injectable()
export class UserService {
  /**
   * Inyecta el repositorio de User para acceder a la base de datos.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario a partir del DTO recibido.
   * @param createUserDto Datos para crear el usuario
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Devuelve todos los usuarios registrados.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Busca un usuario por su id_usuario.
   * Lanza error si no existe.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_usuario: id },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  /**
   * Actualiza los datos de un usuario existente.
   * @param id ID del usuario
   * @param updateUserDto Datos a modificar
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Elimina un usuario por su ID.
   * Lanza error si no existe.
   */
  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Usuario no encontrado');
  }
}
