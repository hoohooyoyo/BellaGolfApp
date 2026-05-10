const app = {
    currentHole: 1,
    data: {
        player: '',
        course: '',
        date: '',
        holes: []
    }
};

function initApp() {
    initHolesData();
    setupNavigation();
    renderHoleTabs();
    renderHoleDetail();
    setupMatchInfoInputs();
    
    // 演示数据按钮事件
    document.getElementById('demo-btn').addEventListener('click', loadDemoData);
    
    // 重置按钮事件
    document.getElementById('reset-btn').addEventListener('click', resetData);
    
    // 数据导出按钮事件
    document.getElementById('export-btn').addEventListener('click', exportData);
    
    // 数据导入按钮事件
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    
    // 文件选择事件
    document.getElementById('import-file').addEventListener('change', importData);
    
    updateStats();
}

function setupMatchInfoInputs() {
    // 球员输入
    document.getElementById('player-input').addEventListener('input', (e) => {
        app.data.player = e.target.value;
    });
    
    // 球场输入
    document.getElementById('course-input').addEventListener('input', (e) => {
        app.data.course = e.target.value;
    });
    
    // 日期输入
    document.getElementById('date-input').addEventListener('input', (e) => {
        app.data.date = e.target.value;
    });
}

function initHolesData() {
    // 按照标准设置每洞的标准杆数
    // 前九洞 (Out)：2 个 Par 3，5 个 Par 4，2 个 Par 5 → 36 杆
    // 后九洞 (In)：2 个 Par 3，5 个 Par 4，2 个 Par 5 → 36 杆
    app.data.holes = [
        { number: 1, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 2, distance: '', par: 3, score: '', shots: [], putts: [], note: '' },
        { number: 3, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 4, distance: '', par: 5, score: '', shots: [], putts: [], note: '' },
        { number: 5, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 6, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 7, distance: '', par: 3, score: '', shots: [], putts: [], note: '' },
        { number: 8, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 9, distance: '', par: 5, score: '', shots: [], putts: [], note: '' },
        { number: 10, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 11, distance: '', par: 3, score: '', shots: [], putts: [], note: '' },
        { number: 12, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 13, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 14, distance: '', par: 5, score: '', shots: [], putts: [], note: '' },
        { number: 15, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 16, distance: '', par: 3, score: '', shots: [], putts: [], note: '' },
        { number: 17, distance: '', par: 4, score: '', shots: [], putts: [], note: '' },
        { number: 18, distance: '', par: 5, score: '', shots: [], putts: [], note: '' }
    ];
}

function resetData() {
    // 重置数据，保留标准杆
    app.data.holes.forEach(hole => {
        hole.score = '';
        hole.shots = [];
        hole.putts = [];
        hole.note = '';
    });
    renderHoleDetail();
    updateStats();
}

function exportData() {
    // 创建CSV内容
    let csv = '球员,球场,日期\n';
    csv += `${app.data.player || ''},${app.data.course || ''},${app.data.date || ''}\n\n`;
    
    csv += '洞号,距离,标准杆,成绩,备注\n';
    app.data.holes.forEach(hole => {
        csv += `${hole.number},${hole.distance || ''},${hole.par},${hole.score || ''},${escapeCSV(hole.note || '')}\n`;
        
        // 挥杆数据
        hole.shots.forEach((shot, idx) => {
            csv += `,挥杆${idx+1},${shot.club || ''},${shot.distance || ''},${shot.direction || ''},${shot.lie || ''},${shot.attack || ''},${shot.penalty || 0}\n`;
        });
        
        // 推杆数据
        hole.putts.forEach((putt, idx) => {
            csv += `,推杆${idx+1},${putt.distance || ''}\n`;
        });
    });
    
    // 创建下载链接
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `golf_data_${app.data.date || new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            parseCSV(content);
            alert('数据导入成功！');
            renderHoleDetail();
            updateStats();
        } catch (error) {
            alert('数据导入失败：' + error.message);
        }
    };
    reader.readAsText(file);
    
    // 重置文件输入
    event.target.value = '';
}

function parseCSV(content) {
    const lines = content.split('\n');
    let lineIndex = 0;
    
    // 解析球员信息
    if (lineIndex < lines.length) {
        const header = lines[lineIndex++].trim();
        if (header === '球员,球场,日期') {
            const data = lines[lineIndex++].trim().split(',');
            app.data.player = data[0] || '';
            app.data.course = data[1] || '';
            app.data.date = data[2] || '';
        }
    }
    
    // 跳过空行
    while (lineIndex < lines.length && lines[lineIndex].trim() === '') {
        lineIndex++;
    }
    
    // 解析洞数据
    if (lineIndex < lines.length) {
        const header = lines[lineIndex++].trim();
        if (header === '洞号,距离,标准杆,成绩,备注') {
            app.data.holes = [];
            let currentHole = null;
            
            while (lineIndex < lines.length) {
                const line = lines[lineIndex++].trim();
                if (line === '') continue;
                
                const parts = parseCSVLine(line);
                
                if (parts.length > 0 && !isNaN(parseInt(parts[0]))) {
                    // 新洞数据
                    if (currentHole) {
                        app.data.holes.push(currentHole);
                    }
                    currentHole = {
                        number: parseInt(parts[0]),
                        distance: parts[1] ? parseInt(parts[1]) : '',
                        par: parseInt(parts[2]),
                        score: parts[3] ? parseInt(parts[3]) : '',
                        shots: [],
                        putts: [],
                        note: parts[4] || ''
                    };
                } else if (parts.length > 1 && currentHole) {
                    // 挥杆或推杆数据
                    const type = parts[1];
                    if (type && type.startsWith('挥杆')) {
                        currentHole.shots.push({
                            club: parts[2] || '',
                            distance: parts[3] ? parseInt(parts[3]) : 0,
                            direction: parts[4] || '',
                            lie: parts[5] || '',
                            attack: parts[6] || '',
                            penalty: parts[7] ? parseInt(parts[7]) : 0
                        });
                    } else if (type && type.startsWith('推杆')) {
                        currentHole.putts.push({
                            distance: parts[2] ? parseInt(parts[2]) : 0
                        });
                    }
                }
            }
            
            if (currentHole) {
                app.data.holes.push(currentHole);
            }
        }
    }
    
    // 更新输入框
    document.getElementById('player-input').value = app.data.player;
    document.getElementById('course-input').value = app.data.course;
    document.getElementById('date-input').value = app.data.date;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i+1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result;
}

function escapeCSV(text) {
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
}

function loadDemoData() {
    // 加载golf0611的击球数据作为演示数据
    app.data.holes = [
        { 
            number: 1, 
            distance: 280, 
            par: 4, 
            score: 4, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 10 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 2, 
            distance: 115, 
            par: 3, 
            score: 3, 
            shots: [
                { club: '7铁', distance: 110, direction: '直球', lie: '球道', attack: '开球', penalty: 0 }
            ], 
            putts: [
                { distance: 14 },
                { distance: 1 }
            ], 
            note: '' 
        },
        { 
            number: 3, 
            distance: 295, 
            par: 4, 
            score: 5, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 15 },
                { distance: 5 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 4, 
            distance: 395, 
            par: 5, 
            score: 5, 
            shots: [
                { club: '1号木', distance: 155, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '3号木', distance: 130, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 },
                { club: '8铁', distance: 85, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 10 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 5, 
            distance: 265, 
            par: 4, 
            score: 3, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 5 }
            ], 
            note: '' 
        },
        { 
            number: 6, 
            distance: 290, 
            par: 4, 
            score: 4, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 10 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 7, 
            distance: 130, 
            par: 3, 
            score: 2, 
            shots: [
                { club: '8铁', distance: 100, direction: '直球', lie: '球道', attack: '开球', penalty: 0 }
            ], 
            putts: [
                { distance: 1 }
            ], 
            note: '' 
        },
        { 
            number: 8, 
            distance: 300, 
            par: 4, 
            score: 4, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 10 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 9, 
            distance: 415, 
            par: 5, 
            score: 6, 
            shots: [
                { club: '1号木', distance: 160, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '3号木', distance: 125, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 },
                { club: '9铁', distance: 80, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 15 },
                { distance: 5 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 10, 
            distance: 285, 
            par: 4, 
            score: 4, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 10 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 11, 
            distance: 125, 
            par: 3, 
            score: 3, 
            shots: [
                { club: '7铁', distance: 105, direction: '直球', lie: '球道', attack: '开球', penalty: 0 }
            ], 
            putts: [
                { distance: 8 },
                { distance: 1 }
            ], 
            note: '' 
        },
        { 
            number: 12, 
            distance: 305, 
            par: 4, 
            score: 4, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 10 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 13, 
            distance: 275, 
            par: 4, 
            score: 3, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 5 }
            ], 
            note: '' 
        },
        { 
            number: 14, 
            distance: 385, 
            par: 5, 
            score: 5, 
            shots: [
                { club: '1号木', distance: 155, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '3号木', distance: 130, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 },
                { club: '8铁', distance: 80, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 10 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 15, 
            distance: 320, 
            par: 4, 
            score: 4, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 10 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 16, 
            distance: 110, 
            par: 3, 
            score: 3, 
            shots: [
                { club: '8铁', distance: 100, direction: '直球', lie: '球道', attack: '开球', penalty: 0 }
            ], 
            putts: [
                { distance: 6 },
                { distance: 1 }
            ], 
            note: '' 
        },
        { 
            number: 17, 
            distance: 290, 
            par: 4, 
            score: 5, 
            shots: [
                { club: '1号木', distance: 150, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '7铁', distance: 95, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 15 },
                { distance: 5 },
                { distance: 2 }
            ], 
            note: '' 
        },
        { 
            number: 18, 
            distance: 405, 
            par: 5, 
            score: 5, 
            shots: [
                { club: '1号木', distance: 160, direction: '直球', lie: '球道', attack: '开球', penalty: 0 },
                { club: '3号木', distance: 125, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 },
                { club: '9铁', distance: 80, direction: '直球', lie: '球道', attack: '进攻', penalty: 0 }
            ], 
            putts: [
                { distance: 10 },
                { distance: 2 }
            ], 
            note: '' 
        }
    ];
    renderHoleDetail();
    updateStats();
}

function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 检查是否是导航按钮（有data-tab属性）
            if (btn.dataset.tab) {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                document.getElementById(`${btn.dataset.tab}-section`).classList.add('active');
                
                if (btn.dataset.tab === 'summary') {
                    updateStats();
                }
            }
            // 演示数据和重置数据按钮会通过其他事件监听器处理
        });
    });
}

function renderHoleTabs() {
    const container = document.getElementById('hole-tabs');
    container.innerHTML = '';
    
    for (let i = 1; i <= 18; i++) {
        const btn = document.createElement('button');
        btn.className = `hole-tab ${i === app.currentHole ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
            app.currentHole = i;
            renderHoleTabs();
            renderHoleDetail();
        });
        container.appendChild(btn);
    }
}

function renderHoleDetail() {
    const hole = app.data.holes[app.currentHole - 1];
    const container = document.getElementById('hole-detail');
    
    // 计算默认成绩：挥杆数+推杆数
    const defaultScore = hole.shots.length + hole.putts.length;

    container.innerHTML = `
        <div class="hole-header">
            <div class="hole-title">第 ${hole.number} 号洞</div>
            <div class="hole-score">
                <div class="score-item">
                    <label>开球距离</label>
                    <div class="drive-distance">${(hole.shots.length > 0 && hole.shots[0].club === '1号木' && hole.distance && hole.shots[0].distance && hole.distance - hole.shots[0].distance > 0) ? (hole.distance - hole.shots[0].distance) + ' yd' : '-'}</div>
                </div>
                <div class="score-item">
                    <label>距离</label>
                    <input type="number" id="distance-input" value="${hole.distance || ''}" min="1">
                </div>
                <div class="score-item">
                    <label>标准杆</label>
                    <input type="number" id="par-input" value="${hole.par}" min="3" max="5">
                </div>
                <div class="score-item">
                    <label>成绩</label>
                    <div class="score-input-wrapper">
                        <input type="number" id="score-input" value="${hole.score || defaultScore || ''}" min="1">
                        <div class="score-diff" id="score-diff"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="input-section">
            <h3>挥杆 & 切杆</h3>
            <div class="shot-grid" id="shots-grid">
                ${hole.shots.length > 0 ? hole.shots.map((shot, idx) => renderShotCard(shot, idx)).join('') : '<p style="color: #999; padding: 10px;">暂无挥杆数据，请点击下方按钮添加</p>'}
            </div>
            <button class="add-btn" onclick="addShot()">+ 添加挥杆</button>
        </div>

        <div class="input-section">
            <h3>推杆</h3>
            <div class="putt-grid" id="putts-grid">
                ${hole.putts.length > 0 ? hole.putts.map((putt, idx) => renderPuttCard(putt, idx)).join('') : '<p style="color: #999; padding: 10px;">暂无推杆数据，请点击下方按钮添加</p>'}
            </div>
            <button class="add-btn" onclick="addPutt()">+ 添加推杆</button>
        </div>

        <div class="input-section">
            <h3>备注</h3>
            <textarea class="note-input" id="note-input" placeholder="记录该洞的备注信息...">${hole.note || ''}</textarea>
        </div>
    `;

    setupHoleInputs();
}

function renderShotCard(shot, index) {
    return `
        <div class="shot-card" data-shot-index="${index}">
            <h4>第 ${index + 1} 杆
                <button class="remove-btn" onclick="removeShot(${index})")">删除</button>
                <button class="voice-btn" onclick="startVoiceRecognition(${index})")">🎤 语音</button>
            </h4>
            <div class="input-row">
                <div class="input-group">
                    <label>球杆</label>
                    <select class="shot-club">
                        <option value="1号木" ${shot.club === '1号木' ? 'selected' : ''}>1号木</option>
                        <option value="3号木" ${shot.club === '3号木' ? 'selected' : ''}>3号木</option>
                        <option value="3号球道木" ${shot.club === '3号球道木' ? 'selected' : ''}>3号球道木</option>
                        <option value="4号球道木" ${shot.club === '4号球道木' ? 'selected' : ''}>4号球道木</option>
                        <option value="6铁" ${shot.club === '6铁' ? 'selected' : ''}>6铁</option>
                        <option value="7铁" ${shot.club === '7铁' ? 'selected' : ''}>7铁</option>
                        <option value="8铁" ${shot.club === '8铁' ? 'selected' : ''}>8铁</option>
                        <option value="9铁" ${shot.club === '9铁' ? 'selected' : ''}>9铁</option>
                        <option value="P杆" ${shot.club === 'P杆' ? 'selected' : ''}>P杆</option>
                        <option value="S杆" ${shot.club === 'S杆' ? 'selected' : ''}>S杆</option>
                        <option value="A杆" ${shot.club === 'A杆' ? 'selected' : ''}>A杆</option>
                        <option value="54度" ${shot.club === '54度' ? 'selected' : ''}>54度</option>
                        <option value="58度" ${shot.club === '58度' ? 'selected' : ''}>58度</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>距离 (yd)</label>
                    <input type="number" class="shot-distance" value="${shot.distance || ''}" min="0">
                </div>
                <div class="input-group">
                    <label>方向</label>
                    <select class="shot-direction">
                        <option value="直球" ${shot.direction === '直球' ? 'selected' : ''}>直球</option>
                        <option value="偏左" ${shot.direction === '偏左' ? 'selected' : ''}>偏左</option>
                        <option value="偏右" ${shot.direction === '偏右' ? 'selected' : ''}>偏右</option>
                        <option value="左曲" ${shot.direction === '左曲' ? 'selected' : ''}>左曲</option>
                        <option value="右曲" ${shot.direction === '右曲' ? 'selected' : ''}>右曲</option>
                    </select>
                </div>
            </div>
            <div class="input-row">
                <div class="input-group">
                    <label>球位</label>
                    <select class="shot-lie">
                        <option value="球道" ${shot.lie === '球道' ? 'selected' : ''}>球道</option>
                        <option value="长草" ${shot.lie === '长草' ? 'selected' : ''}>长草</option>
                        <option value="沙坑" ${shot.lie === '沙坑' ? 'selected' : ''}>沙坑</option>
                        <option value="果岭边" ${shot.lie === '果岭边' ? 'selected' : ''}>果岭边</option>
                        <option value="果岭" ${shot.lie === '果岭' ? 'selected' : ''}>果岭</option>
                        <option value="树林" ${shot.lie === '树林' ? 'selected' : ''}>树林</option>
                        <option value="水障碍" ${shot.lie === '水障碍' ? 'selected' : ''}>水障碍</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>是否直攻</label>
                    <select class="shot-attack">
                        <option value="直攻" ${shot.attack === '直攻' ? 'selected' : ''}>直攻</option>
                        <option value="过渡" ${shot.attack === '过渡' ? 'selected' : ''}>过渡</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>罚杆数</label>
                    <input type="number" class="shot-penalty" value="${shot.penalty || 0}" min="0">
                </div>
            </div>
        </div>
    `;
}

function renderPuttCard(putt, index) {
    return `
        <div class="putt-card" data-putt-index="${index}">
            <h4>第 ${index + 1} 推
                <button class="remove-btn" onclick="removePutt(${index})">删除</button>
            </h4>
            <div class="input-row">
                <div class="input-group">
                    <label>距离 (ft)</label>
                    <input type="number" class="putt-distance" value="${putt.distance || ''}" min="0">
                </div>
            </div>
        </div>
    `;
}

function updateScoreDiff() {
    const hole = app.data.holes[app.currentHole - 1];
    const scoreInput = document.getElementById('score-input');
    const parInput = document.getElementById('par-input');
    const diffDisplay = document.getElementById('score-diff');
    
    if (!scoreInput || !parInput || !diffDisplay) return;
    
    const scoreValue = scoreInput.value.trim();
    if (!scoreValue) {
        diffDisplay.textContent = '';
        diffDisplay.className = 'score-diff';
        return;
    }
    
    const score = parseInt(scoreValue) || 0;
    const par = parseInt(parInput.value) || 4;
    const diff = score - par;
    
    // 清除之前的样式
    diffDisplay.className = 'score-diff';
    
    if (diff === 0) {
        diffDisplay.textContent = 'PAR';
        diffDisplay.classList.add('par');
    } else if (diff > 0) {
        diffDisplay.textContent = `+${diff}`;
        diffDisplay.classList.add('over-par');
    } else {
        diffDisplay.textContent = `${diff}`;
        diffDisplay.classList.add('under-par');
    }
}

// 生成计分卡
function generateScorecard() {
    const holes = app.data.holes;
    
    // 计算out和in的par、score和distance
    let outPar = 0, inPar = 0, outScore = 0, inScore = 0, outDistance = 0, inDistance = 0;
    for (let i = 0; i < 9; i++) {
        outPar += holes[i].par;
        outScore += holes[i].score || 0;
        outDistance += holes[i].distance || 0;
    }
    for (let i = 9; i < 18; i++) {
        inPar += holes[i].par;
        inScore += holes[i].score || 0;
        inDistance += holes[i].distance || 0;
    }
    const totalPar = outPar + inPar;
    const totalScore = outScore + inScore;
    const totalDistance = outDistance + inDistance;
    
    // 生成计分卡HTML
    let html = `
        <div class="scorecard">
            <div class="scorecard-top">
                <table class="scorecard-table scorecard-out">
                    <thead>
                        <tr>
                            <th>Hole</th>
                            ${Array.from({length: 9}, (_, i) => `<th>${i+1}</th>`).join('')}
                            <th class="total">OUT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Tee -->
                        <tr class="tee-row">
                            <td>Tee</td>
                            ${holes.slice(0, 9).map(hole => `<td>${hole.distance || ''}</td>`).join('')}
                            <td class="total">${outDistance}</td>
                        </tr>
                        <!-- Par -->
                        <tr class="par-row">
                            <td>Par</td>
                            ${holes.slice(0, 9).map(hole => `<td>${hole.par}</td>`).join('')}
                            <td class="total">${outPar}</td>
                        </tr>
                        <!-- Score -->
                        <tr class="score-row">
                            <td>Score</td>
                            ${holes.slice(0, 9).map(hole => {
                                const score = hole.score || '';
                                const diff = score && hole.par ? score - hole.par : null;
                                let className = '';
                                if (diff === -2) className = 'eagle';
                                else if (diff === -1) className = 'birdie';
                                else if (diff === 0) className = 'par';
                                else if (diff === 1) className = 'bogey';
                                else if (diff === 2) className = 'double';
                                else if (diff > 2) className = 'other';
                                return `<td class="${className}">${score}</td>`;
                            }).join('')}
                            <td class="total">${outScore}</td>
                        </tr>
                        <!-- To Par -->
                        <tr class="to-par-row">
                            <td>To Par</td>
                            ${holes.slice(0, 9).map(hole => {
                                const score = hole.score || '';
                                const diff = score && hole.par ? score - hole.par : null;
                                let className = '';
                                let display = '';
                                if (diff === 0) {
                                    className = 'par';
                                    display = 'E';
                                } else if (diff) {
                                    if (diff < 0) className = 'under-par';
                                    else className = 'over-par';
                                    display = diff > 0 ? `+${diff}` : diff;
                                }
                                return `<td class="${className}">${display}</td>`;
                            }).join('')}
                            <td class="total">${outScore - outPar === 0 ? 'E' : (outScore - outPar > 0 ? `+${outScore - outPar}` : (outScore - outPar))}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="scorecard-bottom">
                <table class="scorecard-table scorecard-in">
                    <thead>
                        <tr>
                            <th>Hole</th>
                            ${Array.from({length: 9}, (_, i) => `<th>${i+10}</th>`).join('')}
                            <th class="total">IN</th>
                            <th class="total">TOT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Tee -->
                        <tr class="tee-row">
                            <td>Tee</td>
                            ${holes.slice(9, 18).map(hole => `<td>${hole.distance || ''}</td>`).join('')}
                            <td class="total">${inDistance}</td>
                            <td class="total">${totalDistance}</td>
                        </tr>
                        <!-- Par -->
                        <tr class="par-row">
                            <td>Par</td>
                            ${holes.slice(9, 18).map(hole => `<td>${hole.par}</td>`).join('')}
                            <td class="total">${inPar}</td>
                            <td class="total">${totalPar}</td>
                        </tr>
                        <!-- Score -->
                        <tr class="score-row">
                            <td>Score</td>
                            ${holes.slice(9, 18).map(hole => {
                                const score = hole.score || '';
                                const diff = score && hole.par ? score - hole.par : null;
                                let className = '';
                                if (diff === -2) className = 'eagle';
                                else if (diff === -1) className = 'birdie';
                                else if (diff === 0) className = 'par';
                                else if (diff === 1) className = 'bogey';
                                else if (diff === 2) className = 'double';
                                else if (diff > 2) className = 'other';
                                return `<td class="${className}">${score}</td>`;
                            }).join('')}
                            <td class="total">${inScore}</td>
                            <td class="total">${totalScore}</td>
                        </tr>
                        <!-- To Par -->
                        <tr class="to-par-row">
                            <td>To Par</td>
                            ${holes.slice(9, 18).map(hole => {
                                const score = hole.score || '';
                                const diff = score && hole.par ? score - hole.par : null;
                                let className = '';
                                let display = '';
                                if (diff === 0) {
                                    className = 'par';
                                    display = 'E';
                                } else if (diff) {
                                    if (diff < 0) className = 'under-par';
                                    else className = 'over-par';
                                    display = diff > 0 ? `+${diff}` : diff;
                                }
                                return `<td class="${className}">${display}</td>`;
                            }).join('')}
                            <td class="total">${inScore - inPar === 0 ? 'E' : (inScore - inPar > 0 ? `+${inScore - inPar}` : (inScore - inPar))}</td>
                            <td class="total">${totalScore - totalPar === 0 ? 'E' : (totalScore - totalPar > 0 ? `+${totalScore - totalPar}` : (totalScore - totalPar))}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- 颜色图例 -->
            <div class="scorecard-legend">
                <div class="legend-items">
                    <div class="legend-item">
                        <span class="legend-color eagle"></span>
                        <span>Eagles</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color birdie"></span>
                        <span>Birdies</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color par"></span>
                        <span>Pars</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color bogey"></span>
                        <span>Bogeys</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color double"></span>
                        <span>Doubles</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color other"></span>
                        <span>Other</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return html;
}

function setupHoleInputs() {
    const hole = app.data.holes[app.currentHole - 1];
    
    // 开球距离更新函数
    function updateDriveDistanceDisplay() {
        const driveDistanceDiv = document.querySelector('.drive-distance');
        if (driveDistanceDiv) {
            if (hole.shots.length > 0 && hole.shots[0].club === '1号木' && hole.distance && hole.shots[0].distance && (hole.distance - hole.shots[0].distance) > 0) {
                driveDistanceDiv.textContent = (hole.distance - hole.shots[0].distance) + ' yd';
            } else {
                driveDistanceDiv.textContent = '-';
            }
        }
    }
    
    document.getElementById('distance-input').addEventListener('change', (e) => {
        hole.distance = parseInt(e.target.value) || '';
        updateDriveDistanceDisplay();
        updateStats();
    });
    
    document.getElementById('par-input').addEventListener('change', (e) => {
        hole.par = parseInt(e.target.value) || 4;
        updateScoreDiff();
        updateStats();
    });
    
    document.getElementById('score-input').addEventListener('change', (e) => {
        hole.score = parseInt(e.target.value) || hole.par;
        updateScoreDiff();
        updateStats();
    });
    
    // 初始化差值显示
    updateScoreDiff();
    
    document.querySelectorAll('.shot-card').forEach((card, idx) => {
        const clubSelect = card.querySelector('.shot-club');
        const distanceInput = card.querySelector('.shot-distance');
        
        // 如果是第一杆，添加额外的事件监听器来更新开球距离
        if (idx === 0) {
            clubSelect.addEventListener('change', (e) => {
                hole.shots[idx].club = e.target.value;
                updateDriveDistanceDisplay();
                updateStats();
            });
            
            distanceInput.addEventListener('change', (e) => {
                hole.shots[idx].distance = parseInt(e.target.value) || 0;
                updateDriveDistanceDisplay();
                updateStats();
            });
        } else {
            // 其他杆的正常处理
            clubSelect.addEventListener('change', (e) => {
                hole.shots[idx].club = e.target.value;
                updateStats();
            });
            
            distanceInput.addEventListener('change', (e) => {
                hole.shots[idx].distance = parseInt(e.target.value) || 0;
                updateStats();
            });
        }
        
        card.querySelector('.shot-direction').addEventListener('change', (e) => {
            hole.shots[idx].direction = e.target.value;
            updateStats();
        });
        card.querySelector('.shot-lie').addEventListener('change', (e) => {
            hole.shots[idx].lie = e.target.value;
            updateStats();
        });
        card.querySelector('.shot-attack').addEventListener('change', (e) => {
            hole.shots[idx].attack = e.target.value;
            updateStats();
        });
        card.querySelector('.shot-penalty').addEventListener('change', (e) => {
            hole.shots[idx].penalty = parseInt(e.target.value) || 0;
            updateStats();
        });
    });
    
    document.querySelectorAll('.putt-card').forEach((card, idx) => {
        card.querySelector('.putt-distance').addEventListener('change', (e) => {
            hole.putts[idx].distance = parseInt(e.target.value) || 0;
            updateStats();
        });
    });

    // 备注输入框
    const noteInput = document.getElementById('note-input');
    if (noteInput) {
        noteInput.addEventListener('input', (e) => {
            hole.note = e.target.value;
        });
    }
}

function addShot() {
    const hole = app.data.holes[app.currentHole - 1];
    const shotCount = hole.shots.length;
    
    // 根据标准杆和挥杆序号设置默认球杆
    let defaultClub = '7铁'; // 默认7号铁
    if (shotCount === 0) {
        // 第一杆
        if (hole.par === 3) {
            defaultClub = '7铁'; // 标准杆3杆时第一杆默认7号铁
        } else {
            defaultClub = '1号木'; // 其他情况下第一杆默认1号木
        }
    } else if (shotCount === 1 && hole.par === 3) {
        // 标准杆3杆时的第二杆
        defaultClub = '54度'; // 第二杆默认54度切杆
    }
    
    hole.shots.push({ club: defaultClub, distance: 0, direction: '直球', lie: '球道', attack: '过渡', penalty: 0 });
    // 更新成绩：挥杆数+推杆数
    hole.score = hole.shots.length + hole.putts.length;
    renderHoleDetail();
    updateStats();
}

function removeShot(index) {
    const hole = app.data.holes[app.currentHole - 1];
    hole.shots.splice(index, 1);
    // 更新成绩：挥杆数+推杆数
    hole.score = hole.shots.length + hole.putts.length;
    renderHoleDetail();
    updateStats();
}

function addPutt() {
    const hole = app.data.holes[app.currentHole - 1];
    hole.putts.push({ distance: 0 });
    // 更新成绩：挥杆数+推杆数
    hole.score = hole.shots.length + hole.putts.length;
    renderHoleDetail();
    updateStats();
}

function removePutt(index) {
    const hole = app.data.holes[app.currentHole - 1];
    hole.putts.splice(index, 1);
    // 更新成绩：挥杆数+推杆数
    hole.score = hole.shots.length + hole.putts.length;
    renderHoleDetail();
    updateStats();
}

function updateStats() {
    const stats = calculateStats();
    
    // 积分卡
    const scorecardGrid = document.getElementById('stats-scorecard');
    scorecardGrid.innerHTML = generateScorecard();
    
    // 概况
    const overviewGrid = document.getElementById('stats-overview');
    overviewGrid.innerHTML = `
        <div class="stat-card">
            <h3>成绩</h3>
            <div class="value">${stats.overview.score}</div>
        </div>
        <div class="stat-card">
            <h3>推杆</h3>
            <div class="value">${stats.overview.putts}</div>
        </div>
        <div class="stat-card">
            <h3>罚杆</h3>
            <div class="value">${stats.overview.penalties}</div>
        </div>
        <div class="stat-card">
            <h3>标杆上果岭率</h3>
            <div class="value">${formatPercent(stats.overview.girRate)}</div>
        </div>
        <div class="stat-card">
            <h3>一切一推率</h3>
            <div class="value">${formatPercent(stats.overview.upDownRate)}</div>
        </div>
        <div class="stat-card">
            <h3>标上平均推杆</h3>
            <div class="value">${stats.overview.avgPuttsGIR}</div>
        </div>
        <div class="stat-card">
            <h3>平均开球距离</h3>
            <div class="value">${stats.overview.avgDriveDist}<span class="unit">yd</span></div>
        </div>
        <div class="stat-card">
            <h3>最远开球距离</h3>
            <div class="value">${stats.overview.maxDriveDist}<span class="unit">yd</span></div>
        </div>
        <div class="stat-card">
            <h3>开球上球道率</h3>
            <div class="value">${formatPercent(stats.overview.fairwayRate)}</div>
        </div>
        <div class="stat-card">
            <h3>三杆洞平均成绩</h3>
            <div class="value">${stats.overview.avgScorePar3}</div>
        </div>
        <div class="stat-card">
            <h3>四杆洞平均成绩</h3>
            <div class="value">${stats.overview.avgScorePar4}</div>
        </div>
        <div class="stat-card">
            <h3>五杆洞平均成绩</h3>
            <div class="value">${stats.overview.avgScorePar5}</div>
        </div>
        <div class="stat-card">
            <h3>Eagle</h3>
            <div class="value">${stats.overview.eagles}</div>
        </div>
        <div class="stat-card">
            <h3>Birdies</h3>
            <div class="value">${stats.overview.birdies}</div>
        </div>
        <div class="stat-card">
            <h3>Par</h3>
            <div class="value">${stats.overview.pars}</div>
        </div>
        <div class="stat-card">
            <h3>Bogey</h3>
            <div class="value">${stats.overview.bogeys}</div>
        </div>
        <div class="stat-card">
            <h3>Double Bogey</h3>
            <div class="value">${stats.overview.doubleBogeys}</div>
        </div>
    `;
    
    // 开球
    const drivingGrid = document.getElementById('stats-driving');
    drivingGrid.innerHTML = `
        <div class="stat-card">
            <h3>开球球道</h3>
            <div class="value">${formatPercent(stats.driving.fairway)}</div>
        </div>
        <div class="stat-card">
            <h3>开球长草</h3>
            <div class="value">${formatPercent(stats.driving.rough)}</div>
        </div>
        <div class="stat-card">
            <h3>开球沙坑</h3>
            <div class="value">${formatPercent(stats.driving.bunker)}</div>
        </div>
        <div class="stat-card">
            <h3>开球直球</h3>
            <div class="value">${formatPercent(stats.driving.straight)}</div>
        </div>
        <div class="stat-card">
            <h3>开球偏左</h3>
            <div class="value">${formatPercent(stats.driving.left)}</div>
        </div>
        <div class="stat-card">
            <h3>开球偏右</h3>
            <div class="value">${formatPercent(stats.driving.right)}</div>
        </div>
    `;
    
    // 铁杆
    const ironsGrid = document.getElementById('stats-irons');
    ironsGrid.innerHTML = `
        <div class="stat-card">
            <h3>50-75上果岭率</h3>
            <div class="value">${formatPercent(stats.irons.gir5075)}</div>
        </div>
        <div class="stat-card">
            <h3>75-100上果岭率</h3>
            <div class="value">${formatPercent(stats.irons.gir75100)}</div>
        </div>
        <div class="stat-card">
            <h3>100-125上果岭率</h3>
            <div class="value">${formatPercent(stats.irons.gir100125)}</div>
        </div>
        <div class="stat-card">
            <h3>125-150上果岭率</h3>
            <div class="value">${formatPercent(stats.irons.gir125150)}</div>
        </div>
        <div class="stat-card">
            <h3>150-200上果岭率</h3>
            <div class="value">${formatPercent(stats.irons.gir150200)}</div>
        </div>
        <div class="stat-card">
            <h3>200以上上果岭率</h3>
            <div class="value">${formatPercent(stats.irons.gir200plus)}</div>
        </div>
        <div class="stat-card">
            <h3>50-75精准度</h3>
            <div class="value">${stats.irons.acc5075}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>75-100精准度</h3>
            <div class="value">${stats.irons.acc75100}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>100-125精准度</h3>
            <div class="value">${stats.irons.acc100125}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>125-150精准度</h3>
            <div class="value">${stats.irons.acc125150}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>150-200精准度</h3>
            <div class="value">${stats.irons.acc150200}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>200以上精准度</h3>
            <div class="value">${stats.irons.acc200plus}<span class="unit">ft</span></div>
        </div>
    `;
    
    // 切杆
    const chippingGrid = document.getElementById('stats-chipping');
    chippingGrid.innerHTML = `
        <div class="stat-card">
            <h3>0-10yd救球成功率</h3>
            <div class="value">${formatPercent(stats.chipping.save010)}</div>
        </div>
        <div class="stat-card">
            <h3>10-20yd救球成功率</h3>
            <div class="value">${formatPercent(stats.chipping.save1020)}</div>
        </div>
        <div class="stat-card">
            <h3>20-30yd救球成功率</h3>
            <div class="value">${formatPercent(stats.chipping.save2030)}</div>
        </div>
        <div class="stat-card">
            <h3>30-40yd救球成功率</h3>
            <div class="value">${formatPercent(stats.chipping.save3040)}</div>
        </div>
        <div class="stat-card">
            <h3>40-50yd救球成功率</h3>
            <div class="value">${formatPercent(stats.chipping.save4050)}</div>
        </div>
        <div class="stat-card">
            <h3>0-10yd平均剩余</h3>
            <div class="value">${stats.chipping.remain010}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>10-20yd平均剩余</h3>
            <div class="value">${stats.chipping.remain1020}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>20-30yd平均剩余</h3>
            <div class="value">${stats.chipping.remain2030}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>30-40yd平均剩余</h3>
            <div class="value">${stats.chipping.remain3040}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>40-50yd平均剩余</h3>
            <div class="value">${stats.chipping.remain4050}<span class="unit">ft</span></div>
        </div>
        <div class="stat-card">
            <h3>沙坑救球平均剩余</h3>
            <div class="value">${stats.chipping.bunkerRemain}<span class="unit">ft</span></div>
        </div>
    `;
    
    // 推杆
    const puttingGrid = document.getElementById('stats-putting');
    puttingGrid.innerHTML = `
        <div class="stat-card">
            <h3>一推率</h3>
            <div class="value">${formatPercent(stats.putting.onePuttRate)}</div>
        </div>
        <div class="stat-card">
            <h3>三推数</h3>
            <div class="value">${stats.putting.threePutts}</div>
        </div>
        <div class="stat-card">
            <h3>0-3推进概率</h3>
            <div class="value">${formatPercent(stats.putting.prob03)}</div>
        </div>
        <div class="stat-card">
            <h3>3-9推进概率</h3>
            <div class="value">${formatPercent(stats.putting.prob39)}</div>
        </div>
        <div class="stat-card">
            <h3>9-15推进概率</h3>
            <div class="value">${formatPercent(stats.putting.prob915)}</div>
        </div>
        <div class="stat-card">
            <h3>15-30推进概率</h3>
            <div class="value">${formatPercent(stats.putting.prob1530)}</div>
        </div>
        <div class="stat-card">
            <h3>30以上推进概率</h3>
            <div class="value">${formatPercent(stats.putting.prob30plus)}</div>
        </div>
        <div class="stat-card">
            <h3>9-15三推概率</h3>
            <div class="value">${formatPercent(stats.putting.threePutt915)}</div>
        </div>
        <div class="stat-card">
            <h3>15-30三推概率</h3>
            <div class="value">${formatPercent(stats.putting.threePutt1530)}</div>
        </div>
        <div class="stat-card">
            <h3>30以上三推概率</h3>
            <div class="value">${formatPercent(stats.putting.threePutt30plus)}</div>
        </div>
    `;
}

function formatPercent(value) {
    if (value === '-' || isNaN(value)) return '-';
    return (value * 100).toFixed(1) + '%';
}

function calculateStats() {
    // 初始化统计数据
    const stats = {
        overview: {
            score: 0,
            putts: 0,
            penalties: 0,
            girRate: 0,
            upDownRate: 0,
            avgPuttsGIR: 0,
            avgDriveDist: 0,
            maxDriveDist: 0,
            fairwayRate: 0,
            avgScorePar3: 0,
            avgScorePar4: 0,
            avgScorePar5: 0,
            eagles: 0,
            birdies: 0,
            pars: 0,
            bogeys: 0,
            doubleBogeys: 0
        },
        driving: {
            fairway: 0,
            rough: 0,
            bunker: 0,
            straight: 0,
            left: 0,
            right: 0
        },
        irons: {
            gir5075: 0, gir75100: 0, gir100125: 0, gir125150: 0, gir150200: 0, gir200plus: 0,
            acc5075: '-', acc75100: '-', acc100125: '-', acc125150: '-', acc150200: '-', acc200plus: '-'
        },
        chipping: {
            save010: 0, save1020: 0, save2030: 0, save3040: 0, save4050: 0,
            remain010: '-', remain1020: '-', remain2030: '-', remain3040: '-', remain4050: '-',
            bunkerRemain: '-'
        },
        putting: {
            onePuttRate: 0,
            threePutts: 0,
            prob03: 0, prob39: 0, prob915: 0, prob1530: 0, prob30plus: 0,
            threePutt915: 0, threePutt1530: 0, threePutt30plus: 0
        }
    };

    // 临时计数器
    let driveDistances = [];
    let driveCount = 0;
    let fairwayCount = 0;
    let roughCount = 0;
    let bunkerCount = 0;
    let straightCount = 0;
    let leftCount = 0;
    let rightCount = 0;
    let par3Scores = [];
    let par4Scores = [];
    let par5Scores = [];
    let girCount = 0;
    let puttsGIR = 0;
    let upDownAttempts = 0;
    let upDownSuccess = 0;
    
    // 铁杆统计
    let ironAttempts = { '50-75': 0, '75-100': 0, '100-125': 0, '125-150': 0, '150-200': 0, '200plus': 0 };
    let ironGIR = { '50-75': 0, '75-100': 0, '100-125': 0, '125-150': 0, '150-200': 0, '200plus': 0 };
    let ironAccuracy = { '50-75': [], '75-100': [], '100-125': [], '125-150': [], '150-200': [], '200plus': [] };
    
    // 切杆统计
    let chipAttempts = { '0-10': 0, '10-20': 0, '20-30': 0, '30-40': 0, '40-50': 0 };
    let chipSuccess = { '0-10': 0, '10-20': 0, '20-30': 0, '30-40': 0, '40-50': 0 };
    let chipRemain = { '0-10': [], '10-20': [], '20-30': [], '30-40': [], '40-50': [] };
    let bunkerRemain = [];
    
    // 推杆统计
    let puttAttempts = { '0-3': 0, '3-9': 0, '9-15': 0, '15-30': 0, '30plus': 0 };
    let puttSuccess = { '0-3': 0, '3-9': 0, '9-15': 0, '15-30': 0, '30plus': 0 };
    let threePuttAttempts = { '9-15': 0, '15-30': 0, '30plus': 0 };
    let threePuttCount = { '9-15': 0, '15-30': 0, '30plus': 0 };
    let onePuttCount = 0;
    let totalPuttsCount = 0;

    app.data.holes.forEach(hole => {
        // 概况统计
        stats.overview.score += hole.score;
        stats.overview.putts += hole.putts.length;
        totalPuttsCount += hole.putts.length;
        
        // 推杆分析
        if (hole.putts.length === 1) onePuttCount++;
        if (hole.putts.length >= 3) stats.putting.threePutts++;
        
        // 每个推杆都统计尝试次数，只有最后一推算成功
        if (hole.putts.length > 0) {
            hole.putts.forEach((putt, idx) => {
                const dist = putt.distance || 0;
                let range = '';
                if (0 <= dist && dist <= 3) range = '0-3';
                else if (3 < dist && dist <= 9) range = '3-9';
                else if (9 < dist && dist <= 15) range = '9-15';
                else if (15 < dist && dist <= 30) range = '15-30';
                else if (dist > 30) range = '30plus';
                
                puttAttempts[range]++; // 每个推杆都计入尝试次数
                
                // 只有最后一推算成功
                if (idx === hole.putts.length - 1) {
                    puttSuccess[range]++;
                }
            });
            
            // 第一推的距离用于三推统计
            const firstPutt = hole.putts[0];
            const firstDist = firstPutt.distance || 0;
            let firstRange = '';
            if (0 <= firstDist && firstDist <= 3) firstRange = '0-3';
            else if (3 < firstDist && firstDist <= 9) firstRange = '3-9';
            else if (9 < firstDist && firstDist <= 15) firstRange = '9-15';
            else if (15 < firstDist && firstDist <= 30) firstRange = '15-30';
            else if (firstDist > 30) firstRange = '30plus';
            
            // 统计9-15、15-30、30以上三个区间的三推率
            if (['9-15', '15-30', '30plus'].includes(firstRange)) {
                threePuttAttempts[firstRange]++;
                if (hole.putts.length >= 3) {
                    threePuttCount[firstRange]++;
                }
            }
        }
        
        // 成绩分类
        if (hole.score <= hole.par - 2) stats.overview.eagles++;
        else if (hole.score === hole.par - 1) stats.overview.birdies++;
        else if (hole.score === hole.par) stats.overview.pars++;
        else if (hole.score === hole.par + 1) stats.overview.bogeys++;
        else stats.overview.doubleBogeys++;
        
        // 按标准杆分类
        if (hole.par === 3) par3Scores.push(hole.score);
        else if (hole.par === 4) par4Scores.push(hole.score);
        else if (hole.par === 5) par5Scores.push(hole.score);
        
        // 挥杆统计
        let holePenalties = 0;
        
        for (let idx = 0; idx < hole.shots.length; idx++) {
            const shot = hole.shots[idx];
            holePenalties += shot.penalty || 0;
            
            // 开球统计（只有第1杆使用1号木才统计）
            if (idx === 0 && shot.club === '1号木') {
                driveCount++;
                // 开球距离 = 当前球洞距离 - 第1杆后的距离（即第1杆的实际击球距离）
                if (hole.distance && shot.distance) {
                    const driveDistance = hole.distance - shot.distance;
                    if (driveDistance > 0) {
                        driveDistances.push(driveDistance);
                    }
                }
                
                if (shot.lie === '球道') fairwayCount++;
                else if (shot.lie === '长草') roughCount++;
                else if (shot.lie === '沙坑') bunkerCount++;
                
                if (shot.direction === '直球') straightCount++;
                else if (['偏左', '左曲'].includes(shot.direction)) leftCount++;
                else if (['偏右', '右曲'].includes(shot.direction)) rightCount++;
            }
            
            // 铁杆统计（非开球且非推杆）
            if (idx > 0 && shot.club !== '推杆' && shot.distance) {
                const dist = shot.distance;
                let range_key = '';
                if (50 <= dist && dist < 75) range_key = '50-75';
                else if (75 <= dist && dist < 100) range_key = '75-100';
                else if (100 <= dist && dist < 125) range_key = '100-125';
                else if (125 <= dist && dist < 150) range_key = '125-150';
                else if (150 <= dist && dist < 200) range_key = '150-200';
                else if (dist >= 200) range_key = '200plus';
                
                if (range_key) {
                    ironAttempts[range_key]++;
                    if (shot.lie === '果岭') {
                        ironGIR[range_key]++;
                    }
                }
            }
            
            // 切杆统计 (52度和56度是切杆)
            if (['52度', '56度'].includes(shot.club) && shot.distance) {
                const dist = shot.distance;
                let range_key = '';
                if (0 <= dist && dist < 10) range_key = '0-10';
                else if (10 <= dist && dist < 20) range_key = '10-20';
                else if (20 <= dist && dist < 30) range_key = '20-30';
                else if (30 <= dist && dist < 40) range_key = '30-40';
                else if (40 <= dist && dist < 50) range_key = '40-50';
                
                if (range_key) {
                    chipAttempts[range_key]++;
                    if (hole.putts.length === 1) {
                        chipSuccess[range_key]++;
                    }
                }
            }
            
            // 沙坑救球
            if (shot.lie === '沙坑' && shot.club !== '推杆') {
                if (hole.putts.length > 0) {
                    bunkerRemain.push(hole.putts[0].distance || 0);
                }
            }
        }
        
        stats.overview.penalties += holePenalties;
        
        // 标杆上果岭（简化计算）
        if (hole.score - hole.putts.length <= hole.par - 2) {
            girCount++;
            puttsGIR += hole.putts.length;
        }
        
        // 一切一推：只有1次切杆（52度或56度）且只有1次推杆
        const chipShots = hole.shots.filter(s => ['52度', '56度'].includes(s.club));
        if (chipShots.length === 1 && hole.putts.length === 1) {
            upDownSuccess++;
        }
    });
    
    // 计算概况指标
    stats.overview.girRate = girCount / 18;
    stats.overview.upDownRate = upDownSuccess / 18;
    stats.overview.avgPuttsGIR = girCount > 0 ? (puttsGIR / girCount).toFixed(2) : '-';
    stats.overview.avgDriveDist = driveDistances.length > 0 ? Math.round(driveDistances.reduce((a, b) => a + b, 0) / driveDistances.length) : 0;
    stats.overview.maxDriveDist = driveDistances.length > 0 ? Math.max(...driveDistances) : 0;
    stats.overview.fairwayRate = driveCount > 0 ? fairwayCount / driveCount : 0;
    stats.overview.avgScorePar3 = par3Scores.length > 0 ? (par3Scores.reduce((a, b) => a + b, 0) / par3Scores.length).toFixed(2) : '-';
    stats.overview.avgScorePar4 = par4Scores.length > 0 ? (par4Scores.reduce((a, b) => a + b, 0) / par4Scores.length).toFixed(2) : '-';
    stats.overview.avgScorePar5 = par5Scores.length > 0 ? (par5Scores.reduce((a, b) => a + b, 0) / par5Scores.length).toFixed(2) : '-';
    
    // 计算开球指标
    stats.driving.fairway = driveCount > 0 ? fairwayCount / driveCount : 0;
    stats.driving.rough = driveCount > 0 ? roughCount / driveCount : 0;
    stats.driving.bunker = driveCount > 0 ? bunkerCount / driveCount : 0;
    stats.driving.straight = driveCount > 0 ? straightCount / driveCount : 0;
    stats.driving.left = driveCount > 0 ? leftCount / driveCount : 0;
    stats.driving.right = driveCount > 0 ? rightCount / driveCount : 0;
    
    // 计算铁杆指标
    Object.keys(ironAttempts).forEach(range => {
        const key = 'gir' + range.replace('-', '').replace('plus', 'plus');
        stats.irons[key] = ironAttempts[range] > 0 ? ironGIR[range] / ironAttempts[range] : 0;
    });
    
    // 计算切杆指标
    Object.keys(chipAttempts).forEach(range => {
        const key = 'save' + range.replace('-', '');
        stats.chipping[key] = chipAttempts[range] > 0 ? chipSuccess[range] / chipAttempts[range] : 0;
    });
    
    // 计算推杆指标
    stats.putting.onePuttRate = totalPuttsCount > 0 ? onePuttCount / 18 : 0;
    
    Object.keys(puttAttempts).forEach(range => {
        const key = 'prob' + range.replace('-', '');
        stats.putting[key] = puttAttempts[range] > 0 ? puttSuccess[range] / puttAttempts[range] : 0;
    });
    
    Object.keys(threePuttAttempts).forEach(range => {
        const key = 'threePutt' + range.replace('-', '');
        stats.putting[key] = threePuttAttempts[range] > 0 ? threePuttCount[range] / threePuttAttempts[range] : 0;
    });
    
    return stats;
}

// 语音识别功能
function startVoiceRecognition(shotIndex) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('您的浏览器不支持语音识别功能，请使用Chrome或Edge浏览器');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    const hole = app.data.holes[app.currentHole - 1];
    const shot = hole.shots[shotIndex];

    let finalTranscript = '';
    let timeoutId = null;

    // 显示录音状态
    const voiceBtn = document.querySelector(`.shot-card[data-shot-index="${shotIndex}"] .voice-btn`);
    if (voiceBtn) {
        voiceBtn.textContent = '⏹️ 停止';
        voiceBtn.style.background = '#e74c3c';
        voiceBtn.onclick = () => {
            recognition.stop();
            if (finalTranscript) {
                showVoiceConfirmDialog(finalTranscript, shotIndex);
            }
        };
    }

    recognition.onresult = function(event) {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        // 显示临时结果
        if (voiceBtn) {
            voiceBtn.textContent = `🎤 ${interimTranscript || finalTranscript || '录音中...'}`;
        }
        
        // 清除之前的超时
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        // 设置新的超时：5秒没有新的语音输入就结束
        timeoutId = setTimeout(() => {
            if (finalTranscript) {
                console.log('语音识别结果:', finalTranscript);
                showVoiceConfirmDialog(finalTranscript, shotIndex);
                recognition.stop();
            }
        }, 5000);
        
        // 恢复按钮状态
        if (voiceBtn) {
            voiceBtn.textContent = '🎤 语音';
            voiceBtn.style.background = '';
        }
    };

    recognition.onerror = function(event) {
        console.error('语音识别错误:', event.error);
        if (voiceBtn) {
            voiceBtn.textContent = '🎤 语音';
            voiceBtn.style.background = '';
        }
        
        let errorMsg = '语音识别失败';
        switch(event.error) {
            case 'no-speech':
                errorMsg = '没有检测到语音，请重试';
                break;
            case 'audio-capture':
                errorMsg = '无法访问麦克风，请检查麦克风权限';
                break;
            case 'not-allowed':
                errorMsg = '麦克风权限被拒绝，请在浏览器设置中允许访问麦克风';
                break;
            case 'network':
                // 网络错误时，显示手动输入对话框
                showManualVoiceInputDialog(shotIndex);
                return;
            case 'aborted':
                errorMsg = '语音识别已取消';
                break;
            default:
                errorMsg = '语音识别失败: ' + event.error;
        }
        alert(errorMsg);
    };

    recognition.onend = function() {
        if (voiceBtn) {
            voiceBtn.textContent = '🎤 语音';
            voiceBtn.style.background = '';
        }
    };

    try {
        recognition.start();
    } catch (e) {
        console.error('启动语音识别失败:', e);
        if (voiceBtn) {
            voiceBtn.textContent = '🎤 语音';
            voiceBtn.style.background = '';
        }
        showManualVoiceInputDialog(shotIndex);
    }
}

// 显示语音识别确认对话框
function showVoiceConfirmDialog(transcript, shotIndex) {
    // 解析语音指令
    const parsedData = parseVoiceCommandToData(transcript);
    
    const dialog = document.createElement('div');
    dialog.className = 'voice-dialog';
    dialog.innerHTML = `
        <div class="voice-dialog-content">
            <h3>语音识别结果</h3>
            <p class="voice-text">识别内容: "${transcript}"</p>
            <div class="voice-parsed">
                <p><strong>解析结果:</strong></p>
                <ul>
                    <li>球杆: ${parsedData.club || '未识别'}</li>
                    <li>距离: ${parsedData.distance ? parsedData.distance + '码' : '未识别'}</li>
                    <li>方向: ${parsedData.direction || '未识别'}</li>
                    <li>球位: ${parsedData.lie || '未识别'}</li>
                    <li>攻击方式: ${parsedData.attack || '未识别'}</li>
                    <li>罚杆: ${parsedData.penalty || '0'}</li>
                </ul>
            </div>
            <div class="voice-dialog-buttons">
                <button class="voice-btn-confirm" onclick="applyVoiceData(${shotIndex}, '${transcript.replace(/'/g, "\\'")}')">确认应用</button>
                <button class="voice-btn-cancel" onclick="closeVoiceDialog()">取消</button>
                <button class="voice-btn-edit" onclick="showManualVoiceInputDialog(${shotIndex}, '${transcript.replace(/'/g, "\\'")}')">手动编辑</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
}

// 解析语音指令为数据对象
function parseVoiceCommandToData(command) {
    const data = {
        club: '',
        distance: 0,
        direction: '',
        lie: '',
        attack: '',
        penalty: 0
    };
    
    // 球杆映射
    const clubMap = {
        '1号木': ['1号木', '一号木', '发球木'],
        '3号木': ['3号木', '三号木'],
        '球道木': ['球道木', '五号木', '5号木'],
        '6铁': ['6铁', '六号铁'],
        '7铁': ['7铁', '七号铁'],
        '8铁': ['8铁', '八号铁'],
        '9铁': ['9铁', '九号铁'],
        'P杆': ['P杆', '劈起杆', '切杆'],
        '52度': ['52度', '五十二度'],
        '56度': ['56度', '五十六度']
    };
    
    // 方向映射
    const directionMap = {
        '直球': ['直球', '直线'],
        '偏左': ['偏左', '向左', '左边'],
        '偏右': ['偏右', '向右', '右边'],
        '左曲': ['左曲', '左勾', '左弯'],
        '右曲': ['右曲', '右勾', '右弯']
    };
    
    // 球位映射
    const lieMap = {
        '球道': ['球道', '球道上', '球道中'],
        '长草': ['长草', '长草区', '粗草'],
        '沙坑': ['沙坑', '沙池', '沙坑中'],
        '果岭': ['果岭', '果岭上'],
        '其他': ['其他', '树林', '障碍']
    };
    
    // 攻击方式映射
    const attackMap = {
        '直攻': ['直攻', '直接攻击', '攻击'],
        '过渡': ['过渡', '过渡球', '过渡攻击']
    };
    
    // 解析球杆
    for (const [club, keywords] of Object.entries(clubMap)) {
        if (keywords.some(keyword => command.includes(keyword))) {
            data.club = club;
            break;
        }
    }
    
    // 解析距离
    const distanceMatch = command.match(/(\d+)码|(\d+)yard|(\d+)yd|距离(\d+)/);
    if (distanceMatch) {
        const distance = distanceMatch[1] || distanceMatch[2] || distanceMatch[3] || distanceMatch[4];
        data.distance = parseInt(distance) || 0;
    }
    
    // 解析方向
    for (const [direction, keywords] of Object.entries(directionMap)) {
        if (keywords.some(keyword => command.includes(keyword))) {
            data.direction = direction;
            break;
        }
    }
    
    // 解析球位
    for (const [lie, keywords] of Object.entries(lieMap)) {
        if (keywords.some(keyword => command.includes(keyword))) {
            data.lie = lie;
            break;
        }
    }
    
    // 解析攻击方式
    for (const [attack, keywords] of Object.entries(attackMap)) {
        if (keywords.some(keyword => command.includes(keyword))) {
            data.attack = attack;
            break;
        }
    }
    
    // 解析 penalty
    if (command.includes('罚杆') || command.includes(' penalty') || command.includes('加杆')) {
        const penaltyMatch = command.match(/罚杆(\d+)|加杆(\d+)/);
        if (penaltyMatch) {
            data.penalty = parseInt(penaltyMatch[1] || penaltyMatch[2]) || 1;
        } else {
            data.penalty = 1;
        }
    }
    
    return data;
}

// 应用语音数据
function applyVoiceData(shotIndex, transcript) {
    const hole = app.data.holes[app.currentHole - 1];
    const shot = hole.shots[shotIndex];
    
    parseVoiceCommand(transcript, shotIndex);
    closeVoiceDialog();
}

// 关闭语音对话框
function closeVoiceDialog() {
    const dialog = document.querySelector('.voice-dialog');
    if (dialog) {
        dialog.remove();
    }
}

// 显示手动输入对话框
function showManualVoiceInputDialog(shotIndex, defaultText = '') {
    closeVoiceDialog();
    
    const dialog = document.createElement('div');
    dialog.className = 'voice-dialog';
    dialog.innerHTML = `
        <div class="voice-dialog-content">
            <h3>手动输入语音内容</h3>
            <p>请手动输入您要说的内容，格式示例：</p>
            <p class="voice-example">"7铁 150码 直球 球道 直攻"</p>
            <textarea class="voice-input-text" placeholder="输入语音内容...">${defaultText}</textarea>
            <div class="voice-dialog-buttons">
                <button class="voice-btn-confirm" onclick="parseManualVoiceInput(${shotIndex})">解析</button>
                <button class="voice-btn-cancel" onclick="closeVoiceDialog()">取消</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
}

// 解析手动输入
function parseManualVoiceInput(shotIndex) {
    const input = document.querySelector('.voice-input-text');
    if (input && input.value.trim()) {
        showVoiceConfirmDialog(input.value.trim(), shotIndex);
    }
}

function parseVoiceCommand(command, shotIndex) {
    const hole = app.data.holes[app.currentHole - 1];
    const shot = hole.shots[shotIndex];
    
    // 球杆映射
    const clubMap = {
        '1号木': ['1号木', '一号木', '发球木'],
        '3号木': ['3号木', '三号木'],
        '球道木': ['球道木', '五号木', '5号木'],
        '6铁': ['6铁', '六号铁'],
        '7铁': ['7铁', '七号铁'],
        '8铁': ['8铁', '八号铁'],
        '9铁': ['9铁', '九号铁'],
        'P杆': ['P杆', '劈起杆', '切杆'],
        '52度': ['52度', '五十二度'],
        '56度': ['56度', '五十六度']
    };
    
    // 方向映射
    const directionMap = {
        '直球': ['直球', '直线'],
        '偏左': ['偏左', '向左', '左边'],
        '偏右': ['偏右', '向右', '右边'],
        '左曲': ['左曲', '左勾', '左弯'],
        '右曲': ['右曲', '右勾', '右弯']
    };
    
    // 球位映射
    const lieMap = {
        '球道': ['球道', '球道上', '球道中'],
        '长草': ['长草', '长草区', '粗草'],
        '沙坑': ['沙坑', '沙池', '沙坑中'],
        '果岭': ['果岭', '果岭上'],
        '其他': ['其他', '树林', '障碍']
    };
    
    // 攻击方式映射
    const attackMap = {
        '直攻': ['直攻', '直接攻击', '攻击'],
        '过渡': ['过渡', '过渡球', '过渡攻击']
    };
    
    // 解析球杆
    for (const [club, keywords] of Object.entries(clubMap)) {
        if (keywords.some(keyword => command.includes(keyword))) {
            shot.club = club;
            break;
        }
    }
    
    // 解析距离
    const distanceMatch = command.match(/(\d+)码|(\d+)yard|(\d+)yd|距离(\d+)/);
    if (distanceMatch) {
        const distance = distanceMatch[1] || distanceMatch[2] || distanceMatch[3] || distanceMatch[4];
        shot.distance = parseInt(distance) || 0;
    }
    
    // 解析方向
    for (const [direction, keywords] of Object.entries(directionMap)) {
        if (keywords.some(keyword => command.includes(keyword))) {
            shot.direction = direction;
            break;
        }
    }
    
    // 解析球位
    for (const [lie, keywords] of Object.entries(lieMap)) {
        if (keywords.some(keyword => command.includes(keyword))) {
            shot.lie = lie;
            break;
        }
    }
    
    // 解析攻击方式
    for (const [attack, keywords] of Object.entries(attackMap)) {
        if (keywords.some(keyword => command.includes(keyword))) {
            shot.attack = attack;
            break;
        }
    }
    
    // 解析 penalty
    if (command.includes('罚杆') || command.includes(' penalty') || command.includes('加杆')) {
        const penaltyMatch = command.match(/罚杆(\d+)|加杆(\d+)/);
        if (penaltyMatch) {
            shot.penalty = parseInt(penaltyMatch[1] || penaltyMatch[2]) || 1;
        } else {
            shot.penalty = 1;
        }
    }
    
    // 重新渲染
    renderHoleDetail();
    updateStats();
}

document.addEventListener('DOMContentLoaded', initApp);
