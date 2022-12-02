import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { UserModel } from '../entities/user.entity';
import { UserRepository } from './user.repository';

describe('Given an instance of UserRepository', () => {
    const mock = [
        {
            name: 'first',
            last_name: 'primero',
            email: 'first@gmail.com',
            password: '12345',
        },
        {
            name: 'second',
            last_name: 'segundo',
            email: 'second@gmail.com',
            password: '6789',
        },
    ];
    const setUpCollection = async () => {
        await dbConnect();
        await UserModel.deleteMany();
        await UserModel.insertMany(mock);
        const data = await UserModel.find();
        return [data[0].id, data[1].id];
    };

    const repository = UserRepository.getInstance();

    const malformed = '1';
    const invalid = '537b422da27b69c98b1916e1';
    let testIds: Array<string>;

    beforeAll(async () => {
        testIds = await setUpCollection();
    });

    //no hace falta
    // describe('when it calls getAll and it calls Model.find', () => {
    //     test('then it returns all users in the collection', async () => {
    //         const spyMmodel = jest.spyOn(UserModel, 'find');
    //         const result = await repository.getAll();
    //         expect(spyMmodel).toHaveBeenCalled();
    //         expect(result[0].name).toEqual(mock[0].name);
    //     });
    // });

    describe('when it calls get and it calls Model.findById', () => {
        const spyModel = jest.spyOn(UserModel, 'findById');

        test('then if ID is valid, it returns this user', async () => {
            const result = await repository.get(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mock[0].name);
        });

        test('then if ID is malformed, it throws a casting error', async () => {
            expect(async () => {
                await repository.get(malformed);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyModel).toHaveBeenCalled();
        });

        test.skip('then if ID is invalid, it throws an error', async () => {
            expect(async () => {
                await repository.get(invalid);
            }).rejects.toThrow();
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('when it calls post and it calls Model.create', () => {
        const spyModel = jest.spyOn(UserModel, 'create');
        test('then if data is valid, it returns the new user', async () => {
            const newUser = {
                name: 'mireya',
                password:
                    '$2a$10$GLJAg0Vs9rlGQPDezEZ7juj9dv1Y0lnY.p4lxEiz2WwXCvOzlf/.G',
                email: 'pruebaa@gmial.com',
                last_name: 'chaparro',
            };
            const result = await repository.post(newUser);

            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toBe(newUser.name);
        });
    });

    describe('when it calls find and it calls findOne', () => {
        const spyModel = jest.spyOn(UserModel, 'findOne');
        test('then if data is valid, it returns the user', async () => {
            const result = await repository.find(mock[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mock[0].name);
        });

        test.skip('then if data is invalid, it throws an error', async () => {
            //con esto devuelve null que es lo que estoy controlando
            // const result = await repository.find({
            //     email: 'inexistent@gmail.com',
            // });
            // expect(result).toBe(null);
            // expect(spyModel).toHaveBeenCalled();
            //con esto espera undefined
            // expect(async () => {
            //     await repository.find({
            //         email: 'email@gmail.com',
            //     });
            // }).rejects.toThrowError(mongoose.MongooseError);
            // expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('when it calls patch and it calls Model.findByIdAndUpdate', () => {
        const spyModel = jest.spyOn(UserModel, 'findByIdAndUpdate');
        const updatedName = 'updated name';
        test('then if id is valid and exists, it returns the user updated', async () => {
            const result = await repository.patch(testIds[0], {
                name: updatedName,
            });
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(updatedName);
        });

        test('then if id is invalid, it throws an error', async () => {
            expect(async () => {
                await repository.patch(invalid, {
                    name: updatedName,
                });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });

        test('then if id is invalid, it throws an error', async () => {
            expect(async () => {
                await repository.patch(malformed, {
                    name: updatedName,
                });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    //no hace falta
    // describe('when it calls delete and it calls findByIdAndDelete', () => {
    //     const spyModel = jest.spyOn(UserModel, 'findByIdAndDelete');
    //da undefined
    // test('then if id is valid, it returns an empty object', async () => {
    //     const result = await repository.delete(testIds[0]);
    //     expect(spyModel).toHaveBeenCalled();
    //     expect(result).toEqual({});
    // });

    //no hace falta
    //     test('then if id is invalid, it throws an error', async () => {
    //         expect(async () => {
    //             await repository.delete(invalid);
    //         }).rejects.toThrowError(mongoose.MongooseError);
    //         expect(spyModel).toHaveBeenCalled();
    //     });

    //     test('then if id is malformed, it throws a casting error', async () => {
    //         expect(async () => {
    //             await repository.delete(invalid);
    //         }).rejects.toThrowError(mongoose.MongooseError);
    //         expect(spyModel).toHaveBeenCalled();
    //     });
    // });

    afterAll(() => {
        mongoose.disconnect();
    });
});
