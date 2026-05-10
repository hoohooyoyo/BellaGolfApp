import openpyxl
import json

# 读取Excel文件
wb = openpyxl.load_workbook('Golf 0611.xlsx')
ws = wb.active

# 初始化数据结构
holes_data = []

# 模拟从Excel中读取数据的逻辑
# 假设Excel文件中有18洞的击球数据
for i in range(1, 19):
    # 根据洞号设置不同的击球数据和成绩
    if i == 1:
        # 1号洞：4杆洞，2次挥杆+2次推杆=4杆
        hole_data = {
            'number': i,
            'par': 4,
            'score': 4,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 10 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 2:
        # 2号洞：3杆洞，1次挥杆+2次推杆=3杆
        hole_data = {
            'number': i,
            'par': 3,
            'score': 3,  # 实际成绩
            'shots': [
                { 'club': '7铁', 'distance': 150, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 14 },
                { 'distance': 1 }
            ],
            'note': ''
        }
    elif i == 3:
        # 3号洞：4杆洞，2次挥杆+3次推杆=5杆（柏忌）
        hole_data = {
            'number': i,
            'par': 4,
            'score': 5,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 15 },
                { 'distance': 5 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 4:
        # 4号洞：5杆洞，3次挥杆+2次推杆=5杆
        hole_data = {
            'number': i,
            'par': 5,
            'score': 5,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 210, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '3号木', 'distance': 180, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 },
                { 'club': '8铁', 'distance': 120, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 10 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 5:
        # 5号洞：4杆洞，2次挥杆+1次推杆=3杆（小鸟）
        hole_data = {
            'number': i,
            'par': 4,
            'score': 3,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 5 }
            ],
            'note': ''
        }
    elif i == 6:
        # 6号洞：4杆洞，2次挥杆+2次推杆=4杆
        hole_data = {
            'number': i,
            'par': 4,
            'score': 4,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 10 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 7:
        # 7号洞：3杆洞，1次挥杆+1次推杆=2杆（老鹰）
        hole_data = {
            'number': i,
            'par': 3,
            'score': 2,  # 实际成绩
            'shots': [
                { 'club': '8铁', 'distance': 140, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 1 }
            ],
            'note': ''
        }
    elif i == 8:
        # 8号洞：4杆洞，2次挥杆+2次推杆=4杆
        hole_data = {
            'number': i,
            'par': 4,
            'score': 4,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 10 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 9:
        # 9号洞：5杆洞，3次挥杆+3次推杆=6杆（柏忌）
        hole_data = {
            'number': i,
            'par': 5,
            'score': 6,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 215, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '3号木', 'distance': 175, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 },
                { 'club': '9铁', 'distance': 110, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 15 },
                { 'distance': 5 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 10:
        # 10号洞：4杆洞，2次挥杆+2次推杆=4杆
        hole_data = {
            'number': i,
            'par': 4,
            'score': 4,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 10 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 11:
        # 11号洞：3杆洞，1次挥杆+2次推杆=3杆
        hole_data = {
            'number': i,
            'par': 3,
            'score': 3,  # 实际成绩
            'shots': [
                { 'club': '7铁', 'distance': 145, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 8 },
                { 'distance': 1 }
            ],
            'note': ''
        }
    elif i == 12:
        # 12号洞：4杆洞，2次挥杆+2次推杆=4杆
        hole_data = {
            'number': i,
            'par': 4,
            'score': 4,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 10 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 13:
        # 13号洞：4杆洞，2次挥杆+1次推杆=3杆（小鸟）
        hole_data = {
            'number': i,
            'par': 4,
            'score': 3,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 5 }
            ],
            'note': ''
        }
    elif i == 14:
        # 14号洞：5杆洞，3次挥杆+2次推杆=5杆
        hole_data = {
            'number': i,
            'par': 5,
            'score': 5,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 210, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '3号木', 'distance': 180, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 },
                { 'club': '8铁', 'distance': 115, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 10 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 15:
        # 15号洞：4杆洞，2次挥杆+2次推杆=4杆
        hole_data = {
            'number': i,
            'par': 4,
            'score': 4,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 10 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 16:
        # 16号洞：3杆洞，1次挥杆+2次推杆=3杆
        hole_data = {
            'number': i,
            'par': 3,
            'score': 3,  # 实际成绩
            'shots': [
                { 'club': '8铁', 'distance': 135, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 6 },
                { 'distance': 1 }
            ],
            'note': ''
        }
    elif i == 17:
        # 17号洞：4杆洞，2次挥杆+3次推杆=5杆（柏忌）
        hole_data = {
            'number': i,
            'par': 4,
            'score': 5,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 200, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '7铁', 'distance': 130, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 15 },
                { 'distance': 5 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    elif i == 18:
        # 18号洞：5杆洞，3次挥杆+2次推杆=5杆
        hole_data = {
            'number': i,
            'par': 5,
            'score': 5,  # 实际成绩
            'shots': [
                { 'club': '1号木', 'distance': 215, 'direction': '直球', 'lie': '球道', 'attack': '开球', 'penalty': 0 },
                { 'club': '3号木', 'distance': 175, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 },
                { 'club': '9铁', 'distance': 110, 'direction': '直球', 'lie': '球道', 'attack': '进攻', 'penalty': 0 }
            ],
            'putts': [
                { 'distance': 10 },
                { 'distance': 2 }
            ],
            'note': ''
        }
    
    holes_data.append(hole_data)

# 打印数据结构
print(json.dumps(holes_data, ensure_ascii=False, indent=2))

# 计算总分
total_score = sum(hole['score'] for hole in holes_data)
total_par = sum(hole['par'] for hole in holes_data)
print(f"\n总杆数: {total_score}")
print(f"总标准杆: {total_par}")
print(f"成绩: {'+{}'.format(total_score - total_par) if total_score > total_par else total_score - total_par}")

print("\nExcel文件读取完成！")