// Copyright (C) 2005 Rod Roark <rod@sunsetsystems.com>
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// Onkeyup handler for dates.  Converts dates that are keyed in to a
// consistent format, and helps to reduce typing errors.
//
function datekeyup(e, defcc, withtime) {
    if (typeof (withtime) === 'undefined') {
        withtime = false;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const delim = '';
        const arr = [0, 0, 0, 0, 0, 0];
        const v = e.value;
        let ix = 0;

        // Build an array to facilitate error checking.
        for (let i = 0; i < v.length; i += 1) {
            const c = v.charAt(i);
            if (c >= '0' && c <= '9') {
                arr[ix] += 1;
            } else if (ix < 2 && (c === '-' || c === '/')) {
                arr[ix += 1] = 0;
            } else if (withtime && ix === 2 && c === ' ') {
                arr[ix += 1] = 0;
            } else if (withtime && (ix === 3 || ix === 4) && c === ':') {
                arr[ix += 1] = 0;
            } else {
                e.value = v.substring(0, i);
                return;
            }
        }

        // We have finished scanning the string.  If there is a problem,
        // drop the last character and repeat the loop.
        if ((ix > 5) || (!withtime && ix > 2) || (ix > 4 && arr[4] === 0)
            || (ix > 3 && arr[3] === 0) || (ix > 2 && arr[2] === 0)
            || (ix > 1 && arr[1] === 0) || (ix > 0 && arr[0] === 0)
            || (arr[0] > 8) || (ix > 0 && arr[0] > 2 && (arr[0] !== 4
            || arr[1] > 2 || arr[2] > 2)) || (arr[2] > 2 && (arr[2] > 4
            || arr[0] > 2 || arr[1] > 2))) {
            e.value = v.substring(0, v.length - 1);
        } else {
            break;
        }
    }

    // The remainder does reformatting if there is enough data for that.
    if (arr[2] === 4 && defcc === '1') { // mm/dd/yyyy
        e.value = `${v.substring(arr[0] + arr[1] + 2, arr[0] + arr[1] + 6)}-`; // year
        if (arr[0] === 1) {
            e.value += '0';
        }
        e.value += `${v.substring(0, arr[0])}-`; // month
        if (arr[1] === 1) {
            e.value += '0';
        }
        e.value += v.substring(arr[0] + 1, arr[0] + 1 + arr[1]); // day
    } else if (arr[2] === 4) { // dd-mm-yyyy
        e.value = `${v.substring(arr[0] + arr[1] + 2, arr[0] + arr[1] + 6)}-`; // year
        if (arr[1] === 1) {
            e.value += '0';
        }
        e.value += `${v.substring(arr[0] + 1, arr[0] + 1 + arr[1])}-`; // month
        if (arr[0] === 1) {
            e.value += '0';
        }
        e.value += v.substring(0, arr[0]); // day
    } else if (arr[0] === 4 && arr[2] > 0) { // yyyy-mm-dd
        e.value = `${v.substring(0, arr[0])}-`; // year
        if (arr[1] === 1) {
            e.value += '0';
        }
        e.value += `${v.substring(arr[0] + 1, arr[0] + 1 + arr[1])}-`; // month
        // day (may be 1 digit)
        e.value += v.substring(arr[0] + arr[1] + 2, arr[0] + arr[1] + 2 + arr[2]);
    } else if (arr[0] === 8 && defcc === '1') { // yyyymmdd
        e.value = `${v.substring(0, 4)}-`; // year
        e.value += `${v.substring(4, 6)}-`; // month
        e.value += v.substring(6, 8); // day
    } else if (arr[0] === 8) { // ddmmyyyy
        e.value = `${v.substring(4, 8)}-`; // year
        e.value += `${v.substring(2, 4)}-`; // month
        e.value += v.substring(0, 2); // day
    } else {
        return;
    }
    if (withtime) {
        e.value += v.substring(arr[0] + arr[1] + arr[2] + 2);
    }
}

// Onblur handler to avoid incomplete entry of dates.
//
function dateblur(e, defcc, withtime) {
    if (typeof (withtime) === 'undefined') withtime = false;

    const v = e.value;
    if (v.length === 0) {
        return;
    }

    const arr = [0, 0, 0, 0, 0];
    let ix = 0;
    for (let i = 0; i < v.length; i += 1) {
        const c = v.charAt(i);
        if (c >= '0' && c <= '9') {
            arr[ix] += 1;
        } else if (c === '-' || c === '/' || c === ' ' || c === ':') {
            arr[ix += 1] = 0;
        } else {
            alert('Invalid character in date!');
            return;
        }
    }

    // A birth date may be just age in years, in which case we convert it.
    if (ix === 0 && arr[0] > 0 && arr[0] <= 3 && e.name.indexOf('DOB') >= 0) {
        let d = new Date();
        d = new Date(d.getTime() - Number.parseInt(v, 10) * 365.25 * 24 * 60 * 60 * 1000);
        let s = `${d.getFullYear()}-`;
        if (d.getMonth() < 9) {
            s += '0';
        }
        s += `${d.getMonth() + 1}-`;
        if (d.getDate() < 10) {
            s += '0';
        }
        s += d.getDate();
        e.value = s;
        return;
    }

    if ((!withtime && ix !== 2) || (withtime && ix < 2)
        || arr[0] !== 4 || arr[1] !== 2 || arr[2] < 1) {
        if (window.confirm('Date entry is incomplete! Try again?')) {
            e.focus();
        } else {
            e.value = '';
        }
        return;
    }

    if (arr[2] === 1) {
        e.value = `${v.substring(0, 8)}0${v.substring(8)}`;
    }
}

// Private subroutine for US phone number formatting.
function usphone(v) {
    if (v.length > 0 && v.charAt(0) === '-') {
        v = v.substring(1);
    }
    const oldlen = v.length;
    for (let i = 0; i < v.length; i += 1) {
        const c = v.charAt(i);
        if (c < '0' || c > '9') {
            v = v.substring(0, i) + v.substring(i + 1);
            i -= 1;
        }
    }
    if (oldlen > 3 && v.length >= 3) {
        v = `${v.substring(0, 3)}-${v.substring(3)}`;
        if (oldlen > 7 && v.length >= 7) {
            v = `${v.substring(0, 7)}-${v.substring(7)}`;
            if (v.length > 12) v = v.substring(0, 12);
        }
    }
    return v;
}

// Private subroutine for non-US phone number formatting.
function nonusphone(v) {
    for (let i = 0; i < v.length; i += 1) {
        const c = v.charAt(i);
        if (c < '0' || c > '9') {
            v = v.substring(0, i) + v.substring(i + 1);
            i -= 1;
        }
    }
    return v;
}

// Telephone country codes that are exactly 2 digits.
const twodigitccs = '/20/30/31/32/33/34/36/39/40/41/43/44/45/46/47/48/49/51/52/53/54/55/56/57/58/60/61/62/63/64/65/66/81/82/84/86/90/91/92/93/94/95/98/';

// Onkeyup handler for phone numbers.  Helps to ensure a consistent
// format and to reduce typing errors.  defcc is the default telephone
// country code as a string.
//
function phonekeyup(e, defcc) {
    let v = e.value;
    const oldlen = v.length;

    // Deal with international formatting.
    if (v.length > 0 && v.charAt(0) === '+') {
        let cc = '';
        for (let i = 1; i < v.length; i += 1) {
            const c = v.charAt(i);
            if (c < '0' || c > '9') {
                v = v.substring(0, i) + v.substring(i + i);
                i -= 1;
                continue;
            }
            cc += c;
            if (i === 1 && oldlen > 2) {
                if (cc === '1') { // USA
                    e.value = `+1-${usphone(v.substring(2))}`;
                    return;
                }
                if (cc === '7') { // USSR
                    e.value = `+7-${nonusphone(v.substring(2))}`;
                    return;
                }
            } else if (i === 2 && oldlen > 3) {
                if (twodigitccs.indexOf(cc) >= 0) {
                    e.value = `${v.substring(0, 3)}-${nonusphone(v.substring(3))}`;
                    return;
                }
            } else if (i === 3 && oldlen > 4) {
                e.value = `${v.substring(0, 4)}-${nonusphone(v.substring(4))}`;
                return;
            }
        }
        e.value = v;
        return;
    }

    if (defcc === '1') {
        e.value = usphone(v);
    } else {
        e.value = nonusphone(v);
    }
}

// onKeyUp handler for mask-formatted fields.
// This feature is experimental.
function maskkeyup(elem, mask) {
    if (!mask || mask.length === 0) {
        return;
    }
    let i = 0; // elem and mask index
    let v = elem.value;
    for (; i < mask.length && i < v.length; i += 1) {
        const ec = v.charAt(i);
        const mc = mask.charAt(i);
        if (mc === '#' && (ec < '0' || ec > '9')) {
            // digit required but this is not one
            break;
        }
        if (mc === '@' && ec.toLowerCase() === ec.toUpperCase()) {
            // alpha character required but this is not one
            break;
        }
    }
    v = v.substring(0, i);
    while (i < mask.length) {
        const mc = mask.charAt(i += 1);
        if (mc === '*' || mc === '#' || mc === '@') {
            break;
        }
        v += mc;
    }
    elem.value = v;
}

// onBlur handler for mask-formatted fields.
// This feature is experimental.
function maskblur(elem, mask) {
    let v = elem.value;
    let i = mask.length;
    if (i > 0 && v.length > 0 && v.length !== i) {
        // there is a mask and a value but the value is not long enough
        for (; i > 0 && mask.charAt(i - 1) === '#'; i -= 1);
        // i is now index to first # in # string at end of mask
        if (i > v.length) {
            // value is too short even if trailing digits in the mask are ignored
            if (window.confirm('Field entry is incomplete! Try again?')) {
                elem.focus();
            } else {
                elem.value = '';
            }
            return;
        }
        // if the mask ends with digits then right-justify them in the value
        while (v.length < mask.length) {
            v = `${v.substring(0, i)}0${v.substring(i, v.length)}`;
        }
        elem.value = v;
    }
}
