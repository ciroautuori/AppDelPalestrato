<template>
  <div class="w-full h-64">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  workoutPlans: {
    type: Number,
    required: true
  },
  nutritionPlans: {
    type: Number,
    required: true
  },
  exercises: {
    type: Number,
    required: true
  }
});

const chartCanvas = ref(null);
let chart = null;

const createChart = () => {
  if (chart) {
    chart.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Piani Allenamento', 'Piani Nutrizionali', 'Esercizi'],
      datasets: [{
        data: [props.workoutPlans, props.nutritionPlans, props.exercises],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',   // Yellow for workout plans
          'rgba(76, 175, 80, 0.8)',   // Green for nutrition plans
          'rgba(33, 150, 243, 0.8)'   // Blue for exercises
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(33, 150, 243, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#fff',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1
        }
      }
    }
  });
};

// Watch for changes in the data
watch(
  () => [props.workoutPlans, props.nutritionPlans, props.exercises],
  () => {
    createChart();
  }
);

onMounted(() => {
  createChart();
});
</script> 