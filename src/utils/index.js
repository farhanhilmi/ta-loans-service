import moment from 'moment-timezone';
import mongoose from 'mongoose';
import crypto from 'crypto';

export const getCurrentDateIndonesia = () => {
    var date = new Date();
    var tahun = date.getFullYear();
    var bulan = date.getMonth();
    var tanggal = date.getDate();
    var hari = date.getDay();
    var jam = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    var menit =
        date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    var detik =
        date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
    switch (hari) {
        case 0:
            hari = 'Minggu';
            break;
        case 1:
            hari = 'Senin';
            break;
        case 2:
            hari = 'Selasa';
            break;
        case 3:
            hari = 'Rabu';
            break;
        case 4:
            hari = 'Kamis';
            break;
        case 5:
            hari = "Jum'at";
            break;
        case 6:
            hari = 'Sabtu';
            break;
    }
    switch (bulan) {
        case 0:
            bulan = 'Januari';
            break;
        case 1:
            bulan = 'Februari';
            break;
        case 2:
            bulan = 'Maret';
            break;
        case 3:
            bulan = 'April';
            break;
        case 4:
            bulan = 'Mei';
            break;
        case 5:
            bulan = 'Juni';
            break;
        case 6:
            bulan = 'Juli';
            break;
        case 7:
            bulan = 'Agustus';
            break;
        case 8:
            bulan = 'September';
            break;
        case 9:
            bulan = 'Oktober';
            break;
        case 10:
            bulan = 'November';
            break;
        case 11:
            bulan = 'Desember';
            break;
    }

    var dateString = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;
    var time = jam + ':' + menit + ':' + detik;

    return { time, date: dateString };
};

export const formatRupiah = (angka, prefix = 'Rp. ') => {
    console.log('angka', angka);
    var number_string = angka
            .toString()
            .replace(/[^,\d]/g, '')
            .toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : rupiah ? 'Rp. ' + rupiah : '';
};

// Function to encrypt the combined values
export const encryptCombinedValues = (combinedValues, encryptionKey) => {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);

    // Derive a 32-byte encryption key using PBKDF2
    const derivedKey = crypto.pbkdf2Sync(
        encryptionKey,
        iv,
        10000,
        32,
        'sha256',
    );

    // Create a cipher using the encryption key and initialization vector
    const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);

    let encrypted = cipher.update(combinedValues, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Return the encrypted values along with the initialization vector
    return {
        encryptedValues: encrypted,
        iv: iv.toString('hex'),
    };
};

export const toObjectId = (id) => {
    return new mongoose.Types.ObjectId(id);
};

export const getCurrentJakartaTime = () => {
    return moment.tz(Date.now(), 'Asia/Jakarta');
};

export const formatToJakartaTime = (datetime) => {
    return moment.tz(new Date(datetime), 'Asia/Jakarta');
};

export const toTitleCase = (str) => {
    return str
        .split(' ')
        .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
};

/**
 * Validate request payload for required fields
 * @param {Object} payload - Object of request payload
 * @param {Array} requiredFields - Array of required fields
 * @returns {String} String of error fields
 */
export const validateRequestPayload = (payload, requiredFields = []) => {
    let errorFields = [];
    requiredFields.forEach((field) => {
        if (!payload[field]) {
            errorFields.push(field);
        }
    });

    return errorFields.join(', ');

    // if (errorFields.length > 0) {
    //     return false, errorFields;
    //     // throw new ValidationError(
    //     //     `${errorFields.join(', ')} field(s) are required!`,
    //     // );
    // }

    // return true, errorFields;
};
