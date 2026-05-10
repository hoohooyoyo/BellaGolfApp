import openpyxl

# 读取Golf 02.xlsx文件
wb = openpyxl.load_workbook('Golf 02.xlsx')

print("=== 18个洞的完整推杆数据 ===\n")

hole_data = []

for hole_num in range(1, 19):
    sheet_name = f"{hole_num}号洞"
    ws = wb[sheet_name]
    
    putts = []
    # 第一推到第八推
    for putt_row in [7, 9, 11, 13, 15, 17, 19, 21]:
        putt_dist = ws.cell(row=putt_row, column=6).value
        if putt_dist is not None:
            putts.append(putt_dist)
    
    hole_data.append({
        'hole': hole_num,
        'putts': putts
    })
    
    print(f"洞{hole_num}: {putts}")

print("\n=== JavaScript数据格式 ===\n")
print("app.data.holes = [")

for data in hole_data:
    putt_str = ', '.join([f"{{ distance: {d} }}" for d in data['putts']])
    print(f"    {{ number: {data['hole']}, putts: [{putt_str}] }},")

print("];")
