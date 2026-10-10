import { Cpu, CheckCircle2, Radio, Zap } from 'lucide-react';

const hardwareComponents = [
  { name: 'Arduino UNO Q (Main Core)', type: 'Dual Processor Board', status: 'ONLINE', chip: 'Qualcomm QRB2210 Linux' },
  { name: 'STM32U585 Microcontroller', type: 'Real-Time Sensor & Actuation', status: 'ACTIVE', chip: 'Cortex-M33 Ultra-Low-Power' },
  { name: 'SHT41 Precision Sensor', type: 'Ambient Temp & Humidity', status: 'ONLINE', chip: 'I2C High-Accuracy' },
  { name: 'DS18B20 Globe Thermometer', type: 'Radiant Heat Load', status: 'ONLINE', chip: '1-Wire Enclosure Probe' },
  { name: 'Hot-Wire Anemometer', type: 'Air Movement / Speed', status: 'ONLINE', chip: 'Analog Differential' },
  { name: 'MLX90640 Thermal Array', type: 'Surface Thermal Load', status: 'ONLINE', chip: '32x24 IR Camera' },
  { name: 'Solar / Lux Sensor', type: 'Power Ingestion', status: 'ONLINE', chip: 'BH1750 / ADC' },
  { name: '5V Cooling Relay Module', type: 'Autonomous Actuation', status: 'ARMED', chip: 'GPIO High-Current' },
  { name: 'Emergency Piezo Buzzer', type: 'Rest-Break Warning', status: 'ARMED', chip: 'PWM Audio Driver' },
];

export default function HardwareRegistry() {
  return (
    <div className="bg-[#13161F] border border-[#1E2330] p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">Hardware Telemetry Registry</h3>
          <p className="text-xs text-gray-500 font-mono">Real-time status of silicon components & sensors specified in Problem Statement 2.</p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          9/9 Components Operational
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {hardwareComponents.map((hw, idx) => (
          <div key={idx} className="bg-[#090A0F] border border-[#1E2330] p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block">{hw.type}</span>
              <h4 className="text-xs font-bold text-gray-200">{hw.name}</h4>
              <span className="text-[10px] font-mono text-gray-400">{hw.chip}</span>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {hw.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}