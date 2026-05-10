# 详细分析三推率计算过程

holes = [
    {"number": 1, "putts": [{"distance": 5}]},
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
    {"number": 12, "putts": [{"distance": 7}, {"distance": 2}]},
    {"number": 13, "putts": [{"distance": 1}]},
    {"number": 14, "putts": [{"distance": 23}, {"distance": 4}]},
    {"number": 15, "putts": [{"distance": 2}]},
    {"number": 16, "putts": [{"distance": 5}]},
    {"number": 17, "putts": [{"distance": 16}, {"distance": 2}]},
    {"number": 18, "putts": [{"distance": 30}, {"distance": 8}, {"distance": 1}]}
]

threePuttAttempts = {'9-15': 0, '15-30': 0, '30plus': 0}
threePuttCount = {'9-15': 0, '15-30': 0, '30plus': 0}

denominator_9_15 = []
denominator_15_30 = []
denominator_30plus = []
numerator_9_15 = []
numerator_15_30 = []
numerator_30plus = []

print("=== 详细分析每个洞 ===")
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
    
    puttCount = len(hole['putts'])
    isThreePutt = puttCount >= 3
    
    status = f"第一推: {firstDist}ft, 区间: {firstRange}, 推杆数: {puttCount}"
    
    if firstRange in ['9-15', '15-30', '30plus']:
        threePuttAttempts[firstRange] += 1
        if firstRange == '9-15':
            denominator_9_15.append(hole['number'])
        elif firstRange == '15-30':
            denominator_15_30.append(hole['number'])
        elif firstRange == '30plus':
            denominator_30plus.append(hole['number'])
        
        if isThreePutt:
            threePuttCount[firstRange] += 1
            if firstRange == '9-15':
                numerator_9_15.append(hole['number'])
            elif firstRange == '15-30':
                numerator_15_30.append(hole['number'])
            elif firstRange == '30plus':
                numerator_30plus.append(hole['number'])
            status += " ✓ 三推"
    
    print(f"洞{hole['number']}: {status}")

print("\n=== 三推率统计结果 ===")
print("\n【9-15区间】")
print(f"  分母（第一推在该区间）: 洞 {denominator_9_15}")
print(f"  分子（同时是三推）: 洞 {numerator_9_15}")
print(f"  三推率: {threePuttCount['9-15']}/{threePuttAttempts['9-15']} = {threePuttCount['9-15']/threePuttAttempts['9-15']*100 if threePuttAttempts['9-15']>0 else 0:.1f}%")

print("\n【15-30区间】")
print(f"  分母（第一推在该区间）: 洞 {denominator_15_30}")
print(f"  分子（同时是三推）: 洞 {numerator_15_30}")
print(f"  三推率: {threePuttCount['15-30']}/{threePuttAttempts['15-30']} = {threePuttCount['15-30']/threePuttAttempts['15-30']*100 if threePuttAttempts['15-30']>0 else 0:.1f}%")

print("\n【30plus区间】")
print(f"  分母（第一推在该区间）: 洞 {denominator_30plus}")
print(f"  分子（同时是三推）: 洞 {numerator_30plus}")
print(f"  三推率: {threePuttCount['30plus']}/{threePuttAttempts['30plus']} = {threePuttCount['30plus']/threePuttAttempts['30plus']*100 if threePuttAttempts['30plus']>0 else 0:.1f}%")
