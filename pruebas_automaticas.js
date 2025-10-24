// SCRIPT DE PRUEBA AUTOMÁTICA - DETECTOR DE PARÁSITOS (MODELO GRANDE)
console.log('🧪 INICIANDO PRUEBAS DEL SISTEMA CON MODELO GRANDE...');

// Nombres de las clases (parásitos) - ACTUALIZADO
const clasesParasitos = {
    '0': 'Ascaris lumbricoides',
    '1': 'Trichuris trichiura', 
    '2': 'Ancylostoma duodenale',
    '3': 'Giardia lamblia',
    '4': 'Entamoeba histolytica'
};

// Función para probar carga de TensorFlow.js
function probarTensorFlowJS() {
    return new Promise((resolve, reject) => {
        if (typeof tf === 'undefined') {
            reject('TensorFlow.js no está cargado');
            return;
        }
        
        console.log('✅ TensorFlow.js cargado correctamente');
        console.log('📊 Versión:', tf.version.tfjs);
        resolve(true);
    });
}

// Función para probar carga del modelo GRANDE
async function probarCargaModeloGrande() {
    try {
        console.log('🔄 Probando carga del MODELO GRANDE...');
        const modelo = await tf.loadLayersModel('modelo/model.json');
        
        console.log('✅ Modelo GRANDE cargado correctamente');
        console.log('📐 Input shape:', modelo.inputs[0].shape);
        console.log('📐 Output shape:', modelo.outputs[0].shape);
        console.log('🏗️  Número de capas:', modelo.layers.length);
        
        // Probar predicción con datos dummy
        console.log('🧪 Probando predicción con datos de prueba...');
        const dummyData = tf.randomNormal([1, 224, 224, 3]);
        const prediccion = modelo.predict(dummyData);
        const resultados = await prediccion.data();
        
        console.log('✅ Predicción de prueba exitosa');
        console.log('📊 Resultados shape:', prediccion.shape);
        console.log('🎯 Número de clases:', resultados.length);
        
        // Mostrar probabilidades de ejemplo
        console.log('📈 Probabilidades de ejemplo:');
        resultados.forEach((prob, index) => {
            if (index < 5) { // Mostrar solo las primeras 5
                console.log(`   ${clasesParasitos[index]}: ${(prob * 100).toFixed(2)}%`);
            }
        });
        
        // Liberar memoria
        dummyData.dispose();
        prediccion.dispose();
        modelo.dispose();
        
        return true;
    } catch (error) {
        console.error('❌ Error en carga del modelo:', error);
        return false;
    }
}

// Función para probar preprocesamiento de imágenes
function probarPreprocesamiento() {
    try {
        console.log('🖼️ Probando preprocesamiento de imágenes...');
        
        // Crear imagen dummy
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Dibujar algo simple
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 300, 300);
        
        // Probar preprocesamiento
        const tensor = tf.browser.fromPixels(canvas)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .div(255.0)
            .expandDims(0);
        
        console.log('✅ Preprocesamiento funcionando');
        console.log('📐 Tensor shape:', tensor.shape);
        
        tensor.dispose();
        return true;
    } catch (error) {
        console.error('❌ Error en preprocesamiento:', error);
        return false;
    }
}

// Ejecutar todas las pruebas
async function ejecutarPruebasCompletas() {
    console.log('🎯 INICIANDO PRUEBAS COMPLETAS DEL SISTEMA...');
    
    const resultados = {
        tensorflow: false,
        modelo: false,
        preprocesamiento: false
    };
    
    try {
        // Prueba 1: TensorFlow.js
        console.log('\n1️⃣ Probando TensorFlow.js...');
        resultados.tensorflow = await probarTensorFlowJS();
        
        // Prueba 2: Modelo de IA
        console.log('\n2️⃣ Probando Modelo GRANDE...');
        resultados.modelo = await probarCargaModeloGrande();
        
        // Prueba 3: Preprocesamiento
        console.log('\n3️⃣ Probando Preprocesamiento...');
        resultados.preprocesamiento = probarPreprocesamiento();
        
        // Resumen final
        console.log('\n📊 RESUMEN DE PRUEBAS:');
        console.log(`   ✅ TensorFlow.js: ${resultados.tensorflow ? 'PASÓ' : 'FALLÓ'}`);
        console.log(`   ✅ Modelo IA: ${resultados.modelo ? 'PASÓ' : 'FALLÓ'}`);
        console.log(`   ✅ Preprocesamiento: ${resultados.preprocesamiento ? 'PASÓ' : 'FALLÓ'}`);
        
        const todasPasaron = resultados.tensorflow && resultados.modelo && resultados.preprocesamiento;
        
        if (todasPasaron) {
            console.log('🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
            console.log('🚀 El sistema está listo para detectar parásitos');
        } else {
            console.log('❌ Algunas pruebas fallaron - Revisa los errores arriba');
        }
        
        return todasPasaron;
    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
        return false;
    }
}

// Función para mostrar resultados en la página
function mostrarResultadosEnPagina(exito) {
    const resultadoDiv = document.getElementById('testResults');
    if (resultadoDiv) {
        resultadoDiv.innerHTML = exito ? 
            '<div style="color: green; font-weight: bold;">✅ Todas las pruebas pasaron</div>' :
            '<div style="color: red; font-weight: bold;">❌ Algunas pruebas fallaron</div>';
    }
}

// Ejecutar cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Sistema de pruebas inicializado');
    console.log('💡 Para ejecutar pruebas: ejecutarPruebasCompletas()');
});
