const mongoose = require('mongoose');
module.exports = {
    users: [{
        _id: mongoose.Types.ObjectId('5f083c352a7908662c334532'),
        email: 'talent@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 1,
        isActive: 1,
        opt: 123456,
        firstName: 'talent',
        lastName: 'last'
    },
    {
        _id: mongoose.Types.ObjectId('5f083c352a7908662c334533'),
        email: 'client@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 2,
        isActive: 1,
        firstName: 'client',
        lastName: 'last'
    },
    {
        _id: mongoose.Types.ObjectId('5f083c352a7908662c334534'),
        email: 'clientonboard@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 2,
        isActive: 1
    },
    {
        _id: mongoose.Types.ObjectId('5f083c352a7908662c334535'),
        email: 'inactive@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 1,
        isActive: 0,
        opt: 123456
    },
    {
        _id: mongoose.Types.ObjectId('5f05c940aff1590c69b00906'),
        email: 'clientcompany@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 2,
        isActive: 1
    },
    {
        _id: mongoose.Types.ObjectId('5f084e0cd8282d0262380eac'),
        email: 'clientindividual@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 2,
        isActive: 1
    },
    {
        _id: mongoose.Types.ObjectId('5f08589760b8ea193e426d5f'),
        email: 'clientindividualcompany@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 2,
        isActive: 1
    },
    {
        _id: mongoose.Types.ObjectId('5f2d3e4eba0dae43224ae38d'),
        email: 'clientcompanyprofile@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 2,
        isActive: 1
    },
    {
        _id: mongoose.Types.ObjectId('5f5335172317791e189ac32d'),
        email: 'agencybefore@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 3,
        isActive: 1
    },
    {
        _id: mongoose.Types.ObjectId('5f475a9ef25e122eb21d68a8'),
        email: 'agency@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 3,
        isActive: 1
    },
    {
        _id: mongoose.Types.ObjectId('5f4754eb3fc8842306a8220d'),
        isActive: 1,
        otp: 365736,
        phoneOtp: 0,
        isDelete: 0,
        email: 'agencystart@mailinator.com',
        password: '4c84c82de705aabcf74009e221cebcd8:068fe00aef80d4ee1d94e0c59b250a2986a1552a1918faddf3fc446927e56205b3fba7c3943c708c18f6c30f66b60a891cc2c7b0cce978c84a7e3625462ac21cbecfe020a72d2575f68930f63644bf45',
        role: 3,
        firstName: 'Agency',
        lastName: 'Last'
    },
    {
        _id: mongoose.Types.ObjectId('5f523e4a7e416a76f64ea920'),
        firstName: 'Talent One',
        lastName: 'Talent Last One',
        email: 'talent1@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        isActive: 1,
        role: 1
    },
    {
        _id: mongoose.Types.ObjectId('5f523e4a7e416a76f64ea921'),
        firstName: 'Talent Two',
        lastName: 'Talent Last Two',
        email: 'talent2@mailinator.com',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        isActive: 1,
        role: 1
    },
    {
        _id: mongoose.Types.ObjectId('5f5f2cd2f1472c3303b6b861'),
        email: 'super@codemonk.ai',
        password: 'abe57ac6709461b922eccddb91bf8be6:caceaff43d646a8127ef54aac43ab84c818e0cb84c930c57a6e5483b21695630f0998f2a4ed04f1aeb98055520a71856b4c1cd510d558cf8a9e233274d9872402dbc69c39070c30066c3ebb28ed7957c',
        role: 4,
        isActive: 1,
        firstName: 'Codemonk',
        lastName: 'Admin'
    }]
};
