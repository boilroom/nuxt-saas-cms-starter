<script lang="ts" setup>
import { EBody, EContainer, EHead, EHtml, EPreview, ESection, EText, ELink } from 'vue-email';

defineProps<{
  recoveryLink: string;
}>();

const main = {
  backgroundColor: '#fff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const paragraph = {
  fontSize: '16px',
};
</script>

<template>

<EHtml>
    <EHead />
    <EPreview>Password recovery</EPreview>
    <EBody :style="main">
      <EContainer>
        <ESection>
          <EText :style="paragraph">
            You have requested to recover your password. To continue, please click the link below:
          </EText>
          <EText :style="paragraph">
            <ELink :href="recoveryLink">
              Click here to recover your password
            </ELink>
          </EText>
        </ESection>
      </EContainer>
    </EBody>
  </EHtml>
</template>