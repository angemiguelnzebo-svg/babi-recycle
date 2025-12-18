import React, { useState, useEffect } from 'react';
import { MapPin, Battery, Trash2, TrendingUp, AlertTriangle, Wifi, WifiOff, Activity, Zap } from 'lucide-react';

const IoTDashboard = () => {
  const [bins, setBins] = useState([
    {
      id: 1,
      code: 'BIN-ABJ-001',
      name: 'Cocody Centre',
      address: 'Rue des Jardins',
      latitude: 5.3600,
      longitude: -4.0083,
      currentWeight: 45.3,
      capacity: 100,
      batteryLevel: 87,
      status: 'active',
      lastUpdate: new Date(),
      online: true,
      depositsToday: 12
    },
    {
      id: 2,
      code: 'BIN-ABJ-002',
      name: 'Plateau Marché',
      address: 'Avenue Chardy',
      latitude: 5.3260,
      longitude: -4.0267,
      currentWeight: 92.1,
      capacity: 100,
      batteryLevel: 45,
      status: 'full',
      lastUpdate: new Date(Date.now() - 300000),
      online: true,
      depositsToday: 28
    },
    {
      id: 3,
      code: 'BIN-ABJ-003',
      name: 'Yopougon Marché',
      address: 'Boulevard Principal',
      latitude: 5.3453,
      longitude: -4.0891,
      currentWeight: 23.7,
      capacity: 100,
      batteryLevel: 15,
      status: 'low_battery',
      lastUpdate: new Date(Date.now() - 120000),
      online: true,
      depositsToday: 8
    },
    {
      id: 4,
      code: 'BIN-ABJ-004',
      name: 'Treichville Port',
      address: 'Zone Portuaire',
      latitude: 5.2893,
      longitude: -4.0267,
      currentWeight: 67.5,
      capacity: 100,
      batteryLevel: 92,
      status: 'active',
      lastUpdate: new Date(Date.now() - 600000),
      online: false,
      depositsToday: 15
    },
  ]);

  const [selectedBin, setSelectedBin] = useState(null);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'full', binCode: 'BIN-ABJ-002', message: 'Poubelle pleine - collecte urgente', priority: 'high', time: '2 min' },
    { id: 2, type: 'battery', binCode: 'BIN-ABJ-003', message: 'Batterie faible (15%)', priority: 'medium', time: '15 min' },
    { id: 3, type: 'offline', binCode: 'BIN-ABJ-004', message: 'Hors ligne depuis 10 minutes', priority: 'high', time: '10 min' },
  ]);

  // Simuler mises à jour temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setBins(prevBins => prevBins.map(bin => {
        // Simuler petites variations
        const weightChange = (Math.random() - 0.3) * 2;
        const batteryChange = Math.random() > 0.9 ? -1 : 0;
        
        return {
          ...bin,
          currentWeight: Math.max(0, Math.min(bin.capacity, bin.currentWeight + weightChange)),
          batteryLevel: Math.max(0, Math.min(100, bin.batteryLevel + batteryChange)),
          lastUpdate: new Date()
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getFillPercentage = (bin) => (bin.currentWeight / bin.capacity) * 100;

  const getBinStatusColor = (bin) => {
    const fillPercentage = getFillPercentage(bin);
    if (!bin.online) return 'bg-gray-500';
    if (fillPercentage >= 90) return 'bg-red-500';
    if (bin.batteryLevel < 20) return 'bg-orange-500';
    if (fillPercentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBatteryColor = (level) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTimeSinceUpdate = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  // Statistiques globales
  const totalBins = bins.length;
  const activeBins = bins.filter(b => b.online).length;
  const fullBins = bins.filter(b => getFillPercentage(b) >= 90).length;
  const lowBatteryBins = bins.filter(b => b.batteryLevel < 20).length;
  const totalDeposits = bins.reduce((sum, b) => sum + b.depositsToday, 0);
  const totalWeight = bins.reduce((sum, b) => sum + b.currentWeight, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🗑️ Dashboard IoT - Poubelles Intelligentes</h1>
          <p className="text-green-100">Monitoring en temps réel - Babi-Recycle CI</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Poubelles actives</span>
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{activeBins}/{totalBins}</p>
            <p className="text-xs text-gray-500 mt-1">{((activeBins/totalBins)*100).toFixed(0)}% en ligne</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Dépôts aujourd'hui</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalDeposits}</p>
            <p className="text-xs text-green-600 mt-1">+12% vs hier</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Poids total collecté</span>
              <Trash2 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalWeight.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">kg de déchets</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Alertes actives</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{alerts.length}</p>
            <p className="text-xs text-red-600 mt-1">{fullBins} pleines, {lowBatteryBins} batterie faible</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des poubelles */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Poubelles connectées</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Temps réel</span>
              </div>
            </div>

            <div className="space-y-3">
              {bins.map((bin) => {
                const fillPercentage = getFillPercentage(bin);
                
                return (
                  <div 
                    key={bin.id}
                    onClick={() => setSelectedBin(bin)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all cursor-pointer hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`${getBinStatusColor(bin)} w-3 h-3 rounded-full`}></div>
                        <div>
                          <p className="font-semibold text-gray-800">{bin.name}</p>
                          <p className="text-sm text-gray-500">{bin.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {bin.online ? (
                          <Wifi className="w-4 h-4 text-green-600" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-red-600" />
                        )}
                        <Battery className={`w-5 h-5 ${getBatteryColor(bin.batteryLevel)}`} />
                        <span className={`text-sm font-semibold ${getBatteryColor(bin.batteryLevel)}`}>
                          {bin.batteryLevel}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Barre de remplissage */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Remplissage</span>
                          <span className="font-semibold">{fillPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              fillPercentage >= 90 ? 'bg-red-500' : 
                              fillPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="block text-gray-500">Poids</span>
                          <span className="font-semibold text-gray-800">{bin.currentWeight.toFixed(1)} kg</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">Dépôts</span>
                          <span className="font-semibold text-gray-800">{bin.depositsToday}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">MAJ</span>
                          <span className="font-semibold text-gray-800">{getTimeSinceUpdate(bin.lastUpdate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alertes et détails */}
          <div className="space-y-6">
            {/* Alertes */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Alertes</h2>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {alerts.length}
                </span>
              </div>

              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`border-l-4 p-3 rounded ${
                      alert.priority === 'high' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-yellow-500 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className={`text-xs font-semibold ${
                        alert.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {alert.binCode}
                      </span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <button className="mt-2 text-xs text-blue-600 font-semibold hover:underline">
                      Résoudre →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Détails poubelle sélectionnée */}
            {selectedBin && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Détails</h2>
                  <button 
                    onClick={() => setSelectedBin(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{selectedBin.name}</p>
                    <p className="text-sm text-gray-500">{selectedBin.address}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Code</span>
                      <span className="text-sm font-semibold">{selectedBin.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Position GPS</span>
                      <span className="text-sm font-mono text-gray-800">
                        {selectedBin.latitude.toFixed(4)}, {selectedBin.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Capacité</span>
                      <span className="text-sm font-semibold">{selectedBin.capacity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Statut</span>
                      <span className={`text-sm font-semibold ${
                        selectedBin.online ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedBin.online ? '🟢 En ligne' : '🔴 Hors ligne'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Voir sur la carte
                    </button>
                    <button className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 flex items-center justify-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Envoyer commande
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;