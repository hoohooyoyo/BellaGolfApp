import subprocess
import socket
import urllib.request
import ssl

def test_connection():
    results = []
    
    # 1. 测试 Google 基本连通性
    print("=== 测试 Google 服务连通性 ===\n")
    
    # 测试 DNS 解析
    try:
        ip = socket.gethostbyname('www.google.com')
        print(f"✓ DNS 解析成功: www.google.com -> {ip}")
        results.append(('DNS', True))
    except Exception as e:
        print(f"✗ DNS 解析失败: {e}")
        results.append(('DNS', False))
    
    # 2. 测试 HTTP 连接
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        req = urllib.request.Request(
            'https://www.google.com',
            headers={'User-Agent': 'Mozilla/5.0'},
            method='HEAD'
        )
        
        with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
            print(f"✓ HTTP 连接成功: 状态码 {response.status}")
            results.append(('HTTP', True))
    except Exception as e:
        print(f"✗ HTTP 连接失败: {e}")
        results.append(('HTTP', False))
    
    # 3. 测试 Chrome 语音服务
    print("\n=== 测试 Chrome 语音服务 ===\n")
    
    speech_hosts = [
        'speech.googleapis.com',
        'www.google.com/speech-api/v2/recognize',
    ]
    
    for host in speech_hosts:
        try:
            if '/' in host:
                # 这是路径，不是主机名
                print(f"• 跳过路径测试: {host}")
                continue
            ip = socket.gethostbyname(host)
            print(f"✓ {host} -> {ip}")
            results.append((host, True))
        except Exception as e:
            print(f"✗ {host} 解析失败: {e}")
            results.append((host, False))
    
    # 4. 检查系统代理设置
    print("\n=== 系统代理设置 ===\n")
    
    import os
    proxy_vars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy']
    has_proxy = False
    for var in proxy_vars:
        value = os.environ.get(var)
        if value:
            print(f"• {var}: {value}")
            has_proxy = True
    
    if not has_proxy:
        print("• 未检测到系统代理设置")
    
    # 5. 总结
    print("\n=== 测试结果总结 ===\n")
    
    success_count = sum(1 for _, result in results if result)
    total_count = len(results)
    
    print(f"通过: {success_count}/{total_count}")
    
    if success_count == 0:
        print("\n⚠️ 警告: 无法连接到 Google 服务")
        print("语音识别功能可能无法正常工作")
        print("\n建议:")
        print("1. 检查网络连接")
        print("2. 检查是否使用了 VPN 或代理")
        print("3. 检查防火墙设置")
    elif success_count < total_count:
        print("\n⚠️ 部分服务不可用")
        print("语音识别功能可能不稳定")
    else:
        print("\n✓ 网络连接正常")
        print("语音识别功能应该可以正常工作")

if __name__ == '__main__':
    test_connection()
