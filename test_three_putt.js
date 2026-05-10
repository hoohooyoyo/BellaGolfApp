// 测试三推率计算逻辑

const holes = [
    { number: 2, putts: [{ distance: 13 }, { distance: 1 }] },
    { number: 3, putts: [{ distance: 14 }, { distance: 4 }] },
    { number: 4, putts: [{ distance: 9 }, { distance: 3 }] },
    { number: 5, putts: [{ distance: 32 }, { distance: 4 }] },
    { number: 6, putts: [{ distance: 19 }, { distance: 2 }] },
    { number: 7, putts: [{ distance: 39 }, { distance: 9 }] },
    { number: 8, putts: [{ distance: 18 }, { distance: 3 }] },
    { number: 9, putts: [{ distance: 33 }, { distance: 5 }, { distance: 1 }] },
    { number: 10, putts: [{ distance: 19 }, { distance: 2 }] },
    { number: 11, putts: [{ distance: 29 }, { distance: 4 }] },
    { number: 14, putts: [{ distance: 23 }, { distance: 4 }] },
    { number: 17, putts: [{ distance: 16 }, { distance: 2 }] },
    { number: 18, putts: [{ distance: 30 }, { distance: 8 }, { distance: 1 }] }
];

let threePuttAttempts = { '9-15': 0, '15-30': 0, '30plus': 0 };
let threePuttCount = { '9-15': 0, '15-30': 0, '30plus': 0 };

holes.forEach(hole => {
    const firstPutt = hole.putts[0];
    const firstDist = firstPutt.distance || 0;
    let firstRange = '';
    
    if (0 <= firstDist && firstDist <= 3) firstRange = '0-3';
    else if (3 < firstDist && firstDist <= 9) firstRange = '3-9';
    else if (9 < firstDist && firstDist <= 15) firstRange = '9-15';
    else if (15 < firstDist && firstDist <= 30) firstRange = '15-30';
    else if (firstDist > 30) firstRange = '30plus';
    
    console.log(`洞 ${hole.number}: 第一推 ${firstDist}ft, 区间 ${firstRange}, 推杆数 ${hole.putts.length}`);
    
    if (['9-15', '15-30', '30plus'].includes(firstRange)) {
        threePuttAttempts[firstRange]++;
        if (hole.putts.length >= 3) {
            threePuttCount[firstRange]++;
        }
    }
});

console.log('\n统计结果:');
console.log('9-15:', threePuttCount['9-15'], '/', threePuttAttempts['9-15']);
console.log('15-30:', threePuttCount['15-30'], '/', threePuttAttempts['15-30']);
console.log('30plus:', threePuttCount['30plus'], '/', threePuttAttempts['30plus']);
