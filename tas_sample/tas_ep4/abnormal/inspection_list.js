// inspection_list.js
let inspection_list = []; // 이상 발생한 데이터 모음

function add_inspection_data(location_id, sensor_data) {
    const detector = require('./abnormal_detector');
    const result = detector.is_abnormal(sensor_data);

    if (result.is_abnormal) {
        inspection_list.push({
            location_id: location_id,
            timestamp: new Date(),
            sensor_data: sensor_data,
            score: result.score
        });
        console.log(`[알림] 이상 데이터 추가됨: ${location_id}, score=${result.score}`);
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
