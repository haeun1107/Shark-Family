const mqtt = require('mqtt');

const brokerIp = '210.94.199.225';
const brokerPort = 1919;
const brokerUrl = `mqtt://${brokerIp}:${brokerPort}`;
const topic = 'application/4/device/C4DEE2CFB045/rx';  // 수신 대상 토픽

const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log(`✅ MQTT 브로커에 연결됨: ${brokerUrl}`);

  const test_cases = [
    {
      label: '📘 정상 데이터',
      data: {
        nh4: 1,
        ph: 7.2,
        turbi: 10,
        salt: 1,
        do: 5,
        temp: 25,
      },
      delay: 1000
    },
    {
      label: '🟠 경미한 이상 (ph 범위 밖)',
      data: {
        nh4: 2,
        ph: 9.5,
        turbi: 10,
        salt: 1,
        do: 5,
        temp: 25,
      },
      delay: 3000
    },
    {
      label: '🔴 심각한 이상 (ph + nh4 + do)',
      data: {
        nh4: 100,
        ph: 11,
        turbi: 200,
        salt: 2,
        do: 1,
        temp: 40,
      },
      delay: 5000
    }
  ];

  test_cases.forEach((test, index) => {
    setTimeout(() => {
      const message = JSON.stringify({
        applicationID: "4",
        applicationName: "EP4_wifi",
        devEUI: "C4DEE2CFB045",
        data: test.data
      });

      client.publish(topic, message, { qos: 0 }, (err) => {
        if (err) {
          console.error(`❌ 전송 실패: ${test.label}`, err);
        } else {
          console.log(`✅ 전송 성공: ${test.label}`);
        }

        // 마지막 케이스면 연결 종료
        if (index === test_cases.length - 1) {
          setTimeout(() => {
            client.end();
            console.log('📴 MQTT 연결 종료');
          }, 1000);
        }
      });
    }, test.delay);
  });
});
