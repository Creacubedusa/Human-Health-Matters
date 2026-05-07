import { Image, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/ui/Button';
import { primitiveColors } from '@design/tokens';
import { useConsultation } from '../hooks/useConsultation';
import { StarRating } from '../components/consultation/StarRating';

export function ConsultationReviewView() {
  const { t } = useTranslation();
  const {
    doctor,
    rating,
    reviewText,
    wouldRecommend,
    reviewSubmitting,
    canSubmitReview,
    setRating,
    setReviewText,
    setWouldRecommend,
    handleSubmitReview,
  } = useConsultation();

  const doctorName = doctor?.name ?? 'Doctor';
  const specialty = doctor?.specialty ?? 'Consultation';
  const initials = doctor?.avatarInitials ?? 'DR';
  const avatarUri = doctor?.avatarUri ?? null;

  return (
    <SafeAreaView className="flex-1 bg-bg-default">
      <ScrollView
        contentContainerClassName="px-5 pt-6 pb-12 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Duration card */}
        <View className="bg-primary-50 rounded-2xl items-center py-6 gap-1">
          <Text className="text-h3 font-semibold font-sans text-primary-600">
            {t('consultation.reviewDuration', { minutes: '20:00' })}
          </Text>
          <Text className="text-b3 text-text-secondary font-sans">
            {t('consultation.reviewDurationLabel')}
          </Text>
        </View>

        {/* Doctor info */}
        <View className="items-center gap-3">
          <View className="w-20 h-20 rounded-full bg-primary-500 items-center justify-center overflow-hidden">
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={{ width: 80, height: 80 }} />
            ) : (
              <Text className="text-h4 font-semibold font-sans text-white">{initials}</Text>
            )}
          </View>
          <View className="items-center gap-0.5">
            <Text className="text-s1 font-semibold font-sans text-text-primary">{doctorName}</Text>
            <Text className="text-b3 text-text-secondary font-sans">{specialty}</Text>
          </View>
        </View>

        {/* Star rating */}
        <View className="bg-white rounded-2xl p-5 gap-4 shadow-100">
          <Text className="text-s2 font-semibold font-sans text-text-primary text-center">
            {t('consultation.reviewQuestion', { name: doctorName })}
          </Text>
          <View className="items-center">
            <StarRating value={rating} onChange={setRating} />
          </View>
        </View>

        {/* Review text */}
        <View className="bg-white rounded-2xl p-5 gap-3 shadow-100">
          <Text className="text-s2 font-semibold font-sans text-text-primary">
            {t('consultation.reviewWriteLabel')}
          </Text>
          <View className="bg-grey-50 border border-grey-200 rounded-xl p-3 h-28">
            <TextInput
              value={reviewText}
              onChangeText={setReviewText}
              placeholder={t('consultation.reviewPlaceholder')}
              // CSS variables not supported in this RN prop — raw hex from primitiveColors
              placeholderTextColor={primitiveColors['grey-400']}
              className="text-b2 text-text-primary font-sans flex-1"
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
        </View>

        {/* Recommendation */}
        <View className="bg-white rounded-2xl p-5 gap-4 shadow-100">
          <Text className="text-s2 font-semibold font-sans text-text-primary">
            {t('consultation.reviewRecommendQuestion', { name: doctorName })}
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              className={`flex-1 py-3 rounded-xl border items-center ${wouldRecommend === true ? 'bg-primary-500 border-primary-500' : 'bg-white border-grey-300'}`}
              onPress={() => setWouldRecommend(true)}
              accessibilityRole="radio"
              accessibilityState={{ checked: wouldRecommend === true }}
            >
              <Text
                className={`text-btn-medium font-semibold font-sans ${wouldRecommend === true ? 'text-white' : 'text-text-primary'}`}
              >
                {t('consultation.reviewYes')}
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-3 rounded-xl border items-center ${wouldRecommend === false ? 'bg-grey-800 border-grey-800' : 'bg-white border-grey-300'}`}
              onPress={() => setWouldRecommend(false)}
              accessibilityRole="radio"
              accessibilityState={{ checked: wouldRecommend === false }}
            >
              <Text
                className={`text-btn-medium font-semibold font-sans ${wouldRecommend === false ? 'text-white' : 'text-text-primary'}`}
              >
                {t('consultation.reviewNo')}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Submit */}
        <Button
          label={reviewSubmitting ? t('common.loading') : t('consultation.reviewSubmit')}
          onPress={handleSubmitReview}
          disabled={!canSubmitReview || reviewSubmitting}
          fullWidth
          size="large"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
