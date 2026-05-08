import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { primitiveColors } from '@design/tokens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '@shared/components/ui/ScreenHeader';
import { OrderCard } from '@features/patient/components/order/OrderCard';
import { PrescriptionCard } from '@features/patient/components/prescription/PrescriptionCard';
import { TestResultCard } from '@features/patient/components/tests/TestResultCard';
import { useDoctorPatientProfile } from '../hooks/useDoctorPatientProfile';
import {
  DoctorReadOnlyHistoryCard,
  DoctorReadOnlyRadioCard,
} from '../components/patients/DoctorReadOnlyHistoryCard';
import { DoctorCarePlanCard } from '../components/patients/DoctorCarePlanCard';

export type DoctorRecordDetailId =
  | 'patient-history'
  | 'medication'
  | 'order'
  | 'tests'
  | 'prescription'
  | 'medical-reports';

export interface DoctorPatientRecordDetailViewProps {
  patientId: string;
  recordId: DoctorRecordDetailId;
}

const HEADER_TITLE_KEY: Record<DoctorRecordDetailId, string> = {
  'patient-history': 'doctorPatients.patientHistoryTitle',
  medication: 'doctorPatients.medicationTitle',
  order: 'doctorPatients.orderTitle',
  tests: 'doctorPatients.testsTitle',
  prescription: 'doctorPatients.prescriptionTitle',
  'medical-reports': 'doctorPatients.yourCarePlan',
};

// ── Pill tab row ───────────────────────────────────────────────────────────────

function FilterTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <View className="flex-row items-center gap-2">
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => onChange(tab)}
          className={[
            'h-10 rounded-full items-center justify-center px-4',
            active === tab ? 'bg-primary-500' : 'bg-primary-50',
          ].join(' ')}
          accessibilityRole="button"
          accessibilityState={{ selected: active === tab }}
        >
          <Text
            className={[
              'text-[14px] font-semibold font-sans',
              active === tab ? 'text-white' : 'text-primary-500',
            ].join(' ')}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ── Overview donut card (Order screen) ─────────────────────────────────────────

function OrderOverviewCard({
  ongoingCount,
  completedCount,
}: {
  ongoingCount: number;
  completedCount: number;
}) {
  const { t } = useTranslation();
  const total = ongoingCount + completedCount;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <View className="bg-white rounded-2xl border border-grey-200 p-5 flex-row items-center gap-6">
      <View className="items-center justify-center w-[90px] h-[90px]">
        <View
          className="w-[90px] h-[90px] rounded-full items-center justify-center border-[10px] border-primary-500"
          style={{ borderColor: '#4E61F6' }}
        >
          <Text className="text-[20px] font-semibold font-sans text-grey-900">{pct}%</Text>
        </View>
      </View>

      <View className="flex-1 gap-5">
        <Text className="text-[28px] font-semibold font-sans text-grey-900">
          {t('doctorPatients.overview')}
        </Text>
        <View className="gap-4">
          <View className="flex-row items-center gap-3">
            <View className="w-4 h-4 rounded-full bg-red-400" />
            <Text className="text-[14px] font-sans text-grey-900">
              {ongoingCount} {t('doctorPatients.ongoingTab')}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="w-4 h-4 rounded-full bg-primary-500" />
            <Text className="text-[14px] font-sans text-grey-900">
              {completedCount} {t('doctorPatients.completedTab')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function DoctorPatientRecordDetailView({
  patientId,
  recordId,
}: DoctorPatientRecordDetailViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { patient, refresh, refreshing } = useDoctorPatientProfile(patientId);

  const [orderTab, setOrderTab] = useState<'Ongoing' | 'Completed'>('Ongoing');
  const [testTab, setTestTab] = useState<'Lab Tests' | 'Medical images'>('Lab Tests');
  const [rxTab, setRxTab] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [carePlanTab, setCarePlanTab] = useState<'Active' | 'Inactive'>('Active');

  const headerTitle = t(HEADER_TITLE_KEY[recordId]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => void refresh()}
      tintColor={primitiveColors['primary-500']}
      colors={[primitiveColors['primary-500']]}
    />
  );

  const fallbackHref = `/(doctor)/patients/${patientId}` as const;

  if (!patient) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <ScreenHeader
          title={headerTitle}
          fallbackHref={fallbackHref}
          containerClassName="bg-primary-50 h-[66px] justify-end"
          rowClassName="flex-row items-center justify-between px-4 pb-3 h-[48px]"
          titleClassName="text-[16px] font-semibold font-sans text-grey-900"
        />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-[16px] font-semibold font-sans text-grey-900 text-center">
            {t('doctorPatients.patientNotFound')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const records = patient.medicalRecords;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader
        title={headerTitle}
        fallbackHref={fallbackHref}
        containerClassName="bg-primary-50 h-[66px] justify-end"
        rowClassName="flex-row items-center justify-between px-4 pb-3 h-[48px]"
        titleClassName="text-[16px] font-semibold font-sans text-grey-900"
      />

      {/* ── Patient History ───────────────────────────────────────────────────── */}
      {recordId === 'patient-history' ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-24 gap-6"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          <Text className="text-[24px] font-semibold font-sans text-grey-900">
            {t('doctorPatients.patientHistoryScreenTitle')}
          </Text>
          <View className="gap-5">
            <DoctorReadOnlyHistoryCard
              title={t('doctorPatients.patientHistoryChronic')}
              items={records.patientHistoryCategories.chronicDiseases}
              emptyLabel={t('doctorPatients.historyEmptyCategory')}
            />
            <DoctorReadOnlyRadioCard
              title={t('doctorPatients.patientHistoryFamilyDiabetes')}
              answer={records.patientHistoryCategories.familyDiabetesHistory}
              emptyLabel={t('doctorPatients.historyEmptyCategory')}
            />
            <DoctorReadOnlyHistoryCard
              title={t('doctorPatients.patientHistoryFamilyGeneral')}
              items={records.patientHistoryCategories.generalFamilyHistory}
              emptyLabel={t('doctorPatients.historyEmptyCategory')}
            />
            <DoctorReadOnlyHistoryCard
              title={t('doctorPatients.operationLabel')}
              items={records.patientHistoryCategories.surgeries}
              emptyLabel={t('doctorPatients.historyEmptyCategory')}
            />
            <DoctorReadOnlyHistoryCard
              title={t('doctorPatients.patientHistoryAllergies')}
              items={records.patientHistoryCategories.allergies}
              emptyLabel={t('doctorPatients.historyEmptyCategory')}
            />
          </View>
        </ScrollView>
      ) : null}

      {/* ── Medication ───────────────────────────────────────────────────────── */}
      {recordId === 'medication' ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-24 gap-6"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          <Text className="text-[24px] font-semibold font-sans text-grey-900">
            {t('doctorPatients.medicationTitle')}
          </Text>
          <View className="gap-5">
            <DoctorReadOnlyHistoryCard
              title={t('doctorPatients.medicationTypeLabel')}
              items={records.medicationCategories.medicationTypes}
              emptyLabel={t('doctorPatients.historyEmptyCategory')}
            />
            <DoctorReadOnlyHistoryCard
              title={t('doctorPatients.currentMedicationsLabel')}
              items={records.medicationCategories.currentMedications}
              emptyLabel={t('doctorPatients.historyEmptyCategory')}
            />
          </View>
        </ScrollView>
      ) : null}

      {/* ── Order ────────────────────────────────────────────────────────────── */}
      {recordId === 'order' ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-4 pb-24 gap-4"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          <OrderOverviewCard
            ongoingCount={records.orders.filter((o) => o.status === 'ongoing').length}
            completedCount={records.orders.filter((o) => o.status === 'completed').length}
          />

          <View className="flex-row items-center justify-between">
            <Text className="text-[24px] font-semibold font-sans text-grey-900">
              {t('doctorPatients.orderTitle')}
            </Text>
            <Pressable
              className="bg-primary-500 h-10 rounded-xl flex-row items-center justify-center px-4 gap-1"
              onPress={() =>
                router.push({
                  pathname: '/(doctor)/create-order-wizard',
                  params: { patientId: patient.id },
                } as never)
              }
              accessibilityRole="button"
            >
              <Text className="text-[14px] font-semibold font-sans text-white">
                + {t('doctorPatients.createOrderBtn')}
              </Text>
            </Pressable>
          </View>

          <FilterTabs
            tabs={[t('doctorPatients.ongoingTab'), t('doctorPatients.completedTab')]}
            active={orderTab === 'Ongoing' ? t('doctorPatients.ongoingTab') : t('doctorPatients.completedTab')}
            onChange={(tab) =>
              setOrderTab(tab === t('doctorPatients.ongoingTab') ? 'Ongoing' : 'Completed')
            }
          />

          <View className="gap-4">
            {records.orders
              .filter((o) =>
                orderTab === 'Ongoing' ? o.status === 'ongoing' : o.status === 'completed',
              )
              .map((item) => (
                <OrderCard
                  key={item.id}
                  item={item}
                  labels={{
                    urgent: t('doctorPatients.orderUrgent'),
                    notUrgent: t('doctorPatients.orderNotUrgent'),
                    orderedBy: t('doctorPatients.orderedBy'),
                  }}
                />
              ))}
            {records.orders.filter((o) =>
              orderTab === 'Ongoing' ? o.status === 'ongoing' : o.status === 'completed',
            ).length === 0 ? (
              <Text className="text-[14px] font-sans text-grey-500">
                {t('doctorPatients.emptyOrders')}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      ) : null}

      {/* ── Tests ────────────────────────────────────────────────────────────── */}
      {recordId === 'tests' ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-24 gap-6"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          <Text className="text-[24px] font-semibold font-sans text-grey-900">
            {t('doctorPatients.testsTitle')}
          </Text>

          <View className="gap-4">
            <FilterTabs
              tabs={[t('doctorPatients.labTestsTab'), t('doctorPatients.medicalImagesTab')]}
              active={
                testTab === 'Lab Tests'
                  ? t('doctorPatients.labTestsTab')
                  : t('doctorPatients.medicalImagesTab')
              }
              onChange={(tab) =>
                setTestTab(
                  tab === t('doctorPatients.labTestsTab') ? 'Lab Tests' : 'Medical images',
                )
              }
            />

            <Text className="text-[18px] font-semibold font-sans text-grey-900">
              {t('doctorPatients.resultsLabel')}
            </Text>

            <View className="gap-4">
              {records.tests
                .filter((item) =>
                  testTab === 'Lab Tests' ? item.fileType === 'lab' : item.fileType === 'image',
                )
                .map((item) => (
                  <TestResultCard
                    key={item.id}
                    mode="result"
                    fileName={item.fileName}
                    fileType={item.fileType}
                    orderedBy={item.orderedBy}
                    date={item.date}
                    orderedByLabel={t('doctorPatients.orderedBy')}
                    dateLabel={t('doctorPatients.date')}
                  />
                ))}
              {records.tests.filter((item) =>
                testTab === 'Lab Tests' ? item.fileType === 'lab' : item.fileType === 'image',
              ).length === 0 ? (
                <Text className="text-[14px] font-sans text-grey-500">
                  {t('doctorPatients.emptyTests')}
                </Text>
              ) : null}
            </View>
          </View>
        </ScrollView>
      ) : null}

      {/* ── Prescription ─────────────────────────────────────────────────────── */}
      {recordId === 'prescription' ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-24 gap-6"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-[24px] font-semibold font-sans text-grey-900">
              {t('doctorPatients.prescriptionTitle')}
            </Text>
            <Pressable
              className="bg-primary-500 h-10 rounded-xl flex-row items-center justify-center px-4 gap-1"
              onPress={() =>
                router.push(`/(doctor)/patients/${patient.id}/add-prescription` as never)
              }
              accessibilityRole="button"
            >
              <Text className="text-[14px] font-semibold font-sans text-white">
                + {t('doctorPatients.addPrescriptionBtn')}
              </Text>
            </Pressable>
          </View>

          <FilterTabs
            tabs={[
              t('doctorPatients.allTab'),
              t('doctorPatients.activeTab'),
              t('doctorPatients.inactiveTab'),
            ]}
            active={
              rxTab === 'All'
                ? t('doctorPatients.allTab')
                : rxTab === 'Active'
                  ? t('doctorPatients.activeTab')
                  : t('doctorPatients.inactiveTab')
            }
            onChange={(tab) => {
              if (tab === t('doctorPatients.allTab')) setRxTab('All');
              else if (tab === t('doctorPatients.activeTab')) setRxTab('Active');
              else setRxTab('Inactive');
            }}
          />

          <View className="gap-7">
            {records.prescriptions
              .filter((rx) => {
                if (rxTab === 'All') return true;
                if (rxTab === 'Active') return rx.status === 'active';
                return rx.status === 'inactive';
              })
              .map((item) => (
                <PrescriptionCard
                  key={item.id}
                  item={item}
                  labels={{
                    activeStatus: t('doctorPatients.prescriptionActive'),
                    inactiveStatus: t('doctorPatients.prescriptionInactive'),
                    refillLeft: t('doctorPatients.refillLeft'),
                    noRefillLeft: t('doctorPatients.noRefillLeft'),
                  }}
                />
              ))}
            {records.prescriptions.filter((rx) => {
              if (rxTab === 'All') return true;
              if (rxTab === 'Active') return rx.status === 'active';
              return rx.status === 'inactive';
            }).length === 0 ? (
              <Text className="text-[14px] font-sans text-grey-500">
                {t('doctorPatients.emptyPrescriptions')}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      ) : null}

      {/* ── Medical Reports → Care Plans ─────────────────────────────────────── */}
      {recordId === 'medical-reports' ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-24 gap-6"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          <Text className="text-[24px] font-semibold font-sans text-grey-900">
            {t('doctorPatients.yourCarePlan')}
          </Text>

          <View className="gap-4">
            <FilterTabs
              tabs={[t('doctorPatients.activeTab'), t('doctorPatients.inactiveTab')]}
              active={
                carePlanTab === 'Active'
                  ? t('doctorPatients.activeTab')
                  : t('doctorPatients.inactiveTab')
              }
              onChange={(tab) =>
                setCarePlanTab(
                  tab === t('doctorPatients.activeTab') ? 'Active' : 'Inactive',
                )
              }
            />

            <View className="gap-7">
              {records.carePlans
                .filter((cp) =>
                  carePlanTab === 'Active' ? cp.status === 'active' : cp.status === 'inactive',
                )
                .map((plan) => (
                  <DoctorCarePlanCard
                    key={plan.id}
                    plan={plan}
                    onView={() => {}}
                  />
                ))}
              {records.carePlans.filter((cp) =>
                carePlanTab === 'Active' ? cp.status === 'active' : cp.status === 'inactive',
              ).length === 0 ? (
                <Text className="text-[14px] font-sans text-grey-500">
                  {t('doctorPatients.emptyCarePlans')}
                </Text>
              ) : null}
            </View>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
