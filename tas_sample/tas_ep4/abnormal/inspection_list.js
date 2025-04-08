// inspection_list.js
const fs = require('fs');
const path = require('path');

let inspection_list = []; // 이상 발생한 데이터 모음
const detector = require('./abnormal_detector');

// CSV 저장 함수
function save_as_csv(location_id, sensor_data, score) {
    const timestamp = new Date().toISOString();
    const csvLine = `${timestamp},${location_id},${score},${JSON.stringify(sensor_data)}\n`;
  
    const csvPath = path.join(__dirname, 'anomalies.csv');
  
    // 파일이 없으면 헤더 추가
    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, 'timestamp,location_id,score,sensor_data\n');
    }
  
    fs.appendFileSync(csvPath, csvLine);
    console.log(`[CSV 저장 완료] 내용: ${csvLine}`);
  }

function add_inspection_data(location_id, sensor_data) {
    const result = detector.is_abnormal(sensor_data);

    if (result.is_abnormal) {
        inspection_list.push({
            location_id: location_id,
            timestamp: new Date(),
            sensor_data: sensor_data,
            score: result.score
        });
        console.log(`[알림] 이상 데이터 추가됨: ${location_id}, score=${result.score}`);

            // CSV에 저장
    save_as_csv(location_id, sensor_data, result.score);
    }
}

function get_inspection_list() {
    return inspection_list;
}

function clear_inspection_list() {
    inspection_list = [];
    console.log('inspection_list 초기화 완료');
}

module.exports = { add_inspection_data, get_inspection_list, clear_inspection_list };
