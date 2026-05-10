# 测试三推率计算逻辑

holes = [
    {"number": 2, "putts": [{"distance": 13}, {"distance": 1}]},
    {"number": 3, "putts": [{"distance": 14}, {"distance": 4}]},
    {"number": 4, "putts": [{"distance": 9}, {"distance": 3}]},
    {"number": 5, "putts": [{"distance": 32}, {"distance": 4}]},
    {"number": 6, "putts": [{"distance": 19}, {"distance": 2}]},
    {"number": 7, "putts": [{"distance": 39}, {"distance": 9}]},
    {"number": 8, "putts": [{"distance": 18}, {"distance": 3}]},
    {"number": 9, "putts": [{"distance": 33}, {"distance": 5}, {"distance": 1}]},
    {"number": 10, "putts": [{"distance": 19}, {"distance": 2}]},
    {"number": 11, "putts": [{"distance": 29}, {"distance": 4}]},
    {"number": 14, "putts": [{"distance": 23}, {"distance": 4}]},
    {"number": 17, "putts": [{"distance": 16}, {"distance": 2}]},
    {"number": 18, "putts": [{"distance": 30}, {"distance": 8}, {"distance": 1}]}
]

threePuttAttempts = {'9-15': 0, '15-30': 0, '30plus': 0}
threePuttCount = {'9-15': 0, '15-30': 0, '30plus': 0}

for hole in holes:
    firstPutt = hole["putts"][0]
    firstDist = firstPutt.get("distance", 0)
    firstRange = ''
    
    if 0 <= firstDist <= 3:
        firstRange = '0-3'
    elif 3 < firstDist <= 9:
        firstRange = '3-9'
    elif 9 < firstDist <= 15:
        firstRange = '9-15'
    elif 15 < firstDist <= 30:
        firstRange = '15-30'
    elif firstDist > 30:
        firstRange = '30plus'
    
    print(f"洞 {hole['number']}: 第一推 {firstDist}ft, 区间 {firstRange}, 推杆数 {len(hole['putts'])}")
    
    if firstRange in ['9-15', '15-30', '30plus']:
        threePuttAttempts[firstRange] += 1
        if len(hole['putts']) >= 3:
            threePuttCount[firstRange] += 1

print('\n统计结果:')
print('9-15:', threePuttCount['9-15'], '/', threePuttAttempts['9-15'])
print('15-30:', threePuttCount['15-30'], '/', threePuttAttempts['15-30'])
print('30plus:', threePuttCount['30plus'], '/', threePuttAttempts['30plus'])
