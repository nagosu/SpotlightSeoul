import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  private readonly repo: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(User);
  }

  /**
   * Spring @Where(is_deleted = false) 대체.
   * 서비스에서는 이 QB를 기반으로만 조회하도록 강제한다.
   */
  userQb(alias = 'user'): SelectQueryBuilder<User> {
    return this.repo
      .createQueryBuilder(alias)
      .where(`${alias}.is_deleted = :isDeleted`, { isDeleted: false });
  }

  qb(alias = 'user'): SelectQueryBuilder<User> {
    return this.userQb(alias);
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.qb().andWhere('user.id = :id', { id }).getOne();
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }

  findByUsername(username: string): Promise<User | null> {
    return this.qb().andWhere('user.username = :username', { username }).getOne();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.qb().andWhere('user.email = :email', { email }).getOne();
  }

  /**
   * 로그인용: is_deleted=false 기본필터가 항상 적용된 상태에서 email+password 매칭
   * (Spring 1:1: 평문 비교)
   */
  findByEmailAndPasswordActive(email: string, password: string): Promise<User | null> {
    return this.qb()
      .andWhere('user.email = :email', { email })
      .andWhere('user.password = :password', { password })
      .getOne();
  }

  async softDeleteById(id: string): Promise<void> {
    const user = await this.findByIdOrFail(id);
    user.isDeleted = true;
    await this.repo.save(user);
  }

  save(entity: User): Promise<User> {
    return this.repo.save(entity);
  }
}

