<script lang="ts" setup>
import { EBody, EContainer, EHead, EHtml, EPreview, ESection, EText, ELink } from 'vue-email';

defineProps<{
  verificationLink: string;
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
    <EPreview>Welcome aboard!</EPreview>
    <EBody :style="main">
      <EContainer>
        <ESection>
          <EText :style="paragraph">
            Welcome aboard! We're excited to have you on board. Please click the link below to verify your email address.
          </EText>
          <EText :style="paragraph">
            <ELink :href="verificationLink">
              Verify your email address
            </ELink>
          </EText>
        </ESection>
      </EContainer>
    </EBody>
  </EHtml>
</template>