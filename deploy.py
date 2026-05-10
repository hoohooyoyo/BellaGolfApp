import os
import requests
import base64

# 配置
GITHUB_TOKEN = ''  # 请在这里输入您的GitHub token
REPO = 'hoohooyoyo/BellaGolfApp'
BRANCH = 'main'

# 要更新的文件
files_to_update = [
    'index.html',
    'src/app.js',
    'src/styles.css'
]

def update_file(file_path):
    print(f"Updating {file_path}...")
    
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 编码内容为base64
    encoded_content = base64.b64encode(content.encode('utf-8')).decode('utf-8')
    
    # 构建API URL
    api_url = f"https://api.github.com/repos/{REPO}/contents/{file_path}"
    
    # 获取文件的当前sha
    response = requests.get(api_url, params={'ref': BRANCH})
    if response.status_code == 200:
        file_info = response.json()
        sha = file_info['sha']
    else:
        sha = None
    
    # 准备更新数据
    data = {
        'message': f'Update {file_path}',
        'content': encoded_content,
        'branch': BRANCH
    }
    if sha:
        data['sha'] = sha
    
    # 发送更新请求
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    response = requests.put(api_url, json=data, headers=headers)
    
    if response.status_code in [200, 201]:
        print(f"✓ {file_path} updated successfully")
    else:
        print(f"✗ Failed to update {file_path}")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.json()}")

def main():
    if not GITHUB_TOKEN:
        print("Please set your GitHub token in the script")
        return
    
    for file_path in files_to_update:
        update_file(file_path)
    
    print("\nDeployment completed!")

if __name__ == '__main__':
    main()
