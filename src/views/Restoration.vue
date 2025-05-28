<script setup>
import { computed } from 'vue';
import { useRestorationStore } from '@/store/restoration';
import StepIndicator from '@/components/StepIndicator.vue';
import Step1Content from '@/components/steps/Step1Content.vue';
import Step2Content from '@/components/steps/Step2Content.vue';
import Step3Content from '@/components/steps/Step3Content.vue';
import Step4Content from '@/components/steps/Step4Content.vue';
import Step5Content from '@/components/steps/Step5Content.vue';

const restorationStore = useRestorationStore();

const currentComponent = computed(() => {
  switch (restorationStore.currentStep) {
    case 1: return Step1Content;
    case 2: return Step2Content;
    case 3: return Step3Content;
    case 4: return Step4Content;
    case 5: return Step5Content;
    default: return null;
  }
});

const goToPreviousStep = () => {
  if (restorationStore.currentStep > 1) {
    if (restorationStore.currentStep === 4) {
      restorationStore.setCurrentStep(2); // На шаге 4 переходим на шаг 2
    } else {
      restorationStore.setCurrentStep(restorationStore.currentStep - 1); // Иначе уменьшаем на 1
    }
  }
};
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- даём снизу отступ = высоте индикатора (например, 4rem = 16) -->
    <div class="flex-1 overflow-auto pb-16">
      <component
          :is="currentComponent"
          :go-to-previous-step="goToPreviousStep"
          :show-back-button="restorationStore.currentStep > 1"
      />
    </div>

    <StepIndicator class="w-full h-16" />
  </div>
</template>


