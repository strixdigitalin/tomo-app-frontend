import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  ScrollView, Image, ActivityIndicator,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useIsFocused } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { App_Primary_color, darkMode25, dark33, white } from '../../../common/Colors/colors'
import { FONTS_FAMILY } from '../../../assets/Fonts'
import { apiGet } from '../../../utils/Apis'
import { SafeAreaView } from 'react-native-safe-area-context'

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PLACED:    { color: '#FF7043', bg: '#FFF3EE', icon: 'package-variant',        label: 'Order Placed'    },
  CONFIRMED: { color: '#1E88E5', bg: '#EEF4FF', icon: 'check-circle-outline',    label: 'Confirmed'       },
  SHIPPED:   { color: '#8E24AA', bg: '#F5EEF8', icon: 'truck-delivery-outline',  label: 'Shipped'         },
  DELIVERED: { color: '#2E7D32', bg: '#EFF8F1', icon: 'check-decagram-outline',  label: 'Delivered'       },
  CANCELLED: { color: '#C62828', bg: '#FEECEC', icon: 'close-circle-outline',    label: 'Cancelled'       },
}

const PAYMENT_STATUS_CONFIG = {
  PENDING: { color: '#FFA000', bg: '#FFF8E1', label: 'Pending'  },
  PAID:    { color: '#2E7D32', bg: '#EFF8F1', label: 'Paid'     },
  FAILED:  { color: '#C62828', bg: '#FEECEC', label: 'Failed'   },
}

const getStatus  = (s) => STATUS_CONFIG[s]  || { color: '#888', bg: '#F5F5F5', icon: 'help-circle-outline', label: s }
const getPayStat = (s) => PAYMENT_STATUS_CONFIG[s] || { color: '#888', bg: '#F5F5F5', label: s }

// ─── Order timeline steps ─────────────────────────────────────────────────────
const TIMELINE = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

const stepIndex = (status) => TIMELINE.indexOf(status)

// ─────────────────────────────────────────────────────────────────────────────
export default function OrderDetailScreen({ navigation, route }) {
  const isFocused      = useIsFocused()
  const { isDarkMode } = useSelector(state => state.theme)
  const orderId        = route?.params?.orderId ?? null

  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    if (!orderId) return
    try {
      setLoading(true)
      const res = await apiGet(`/api/shop/UserGetAOrderDetail/${orderId}`)
      const data = res?.data?.[0] ?? res?.data ?? null
      setOrder(data)
    } catch (e) {
      console.log('fetchOrder error:', e)
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => { if (isFocused) fetchOrder() }, [isFocused])

  // ── Colors ──────────────────────────────────────────────────────────────────
  const bg        = isDarkMode ? darkMode25 : '#F4F4F8'
  const cardBg    = isDarkMode ? dark33     : '#FFFFFF'
  const textPrim  = isDarkMode ? '#FFFFFF'  : '#111111'
  const textSec   = isDarkMode ? '#AAAAAA'  : '#777777'
  const borderCol = isDarkMode ? '#2A2A2A'  : '#EEEEEE'

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
        <ActivityIndicator size="large" color={App_Primary_color} />
        <Text style={[styles.loaderText, { color: textSec }]}>Loading order details...</Text>
      </View>
    )
  }

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialCommunityIcons name="package-variant-closed" size={64} color={isDarkMode ? '#444' : '#DDD'} />
        <Text style={[styles.emptyTitle, { color: textPrim }]}>Order Not Found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackBtn}>
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const status   = getStatus(order.OrderStatus)
  const payStat  = getPayStat(order.PaymentStatus)
  const curStep  = stepIndex(order.OrderStatus)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderCol }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={textPrim} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: textPrim }]}>Order Details</Text>
          <Text style={[styles.headerSub, { color: textSec }]}>{order.OrderNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <MaterialCommunityIcons name={status.icon} size={13} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Order Timeline ── */}
        {order.OrderStatus !== 'CANCELLED' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <Text style={[styles.cardTitle, { color: textPrim }]}>Order Progress</Text>
            <View style={styles.timeline}>
              {TIMELINE.map((step, idx) => {
                const done    = idx <= curStep
                const current = idx === curStep
                const cfg     = getStatus(step)
                return (
                  <View key={step} style={styles.timelineItem}>
                    {/* Connector line */}
                    {idx < TIMELINE.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: idx < curStep ? App_Primary_color : borderCol }]} />
                    )}
                    {/* Circle */}
                    <View style={[
                      styles.timelineCircle,
                      done
                        ? { backgroundColor: App_Primary_color, borderColor: App_Primary_color }
                        : { backgroundColor: cardBg, borderColor: borderCol },
                    ]}>
                      {done
                        ? <Ionicons name="checkmark" size={12} color={white} />
                        : <View style={[styles.timelineDot, { backgroundColor: borderCol }]} />
                      }
                    </View>
                    <Text style={[
                      styles.timelineLabel,
                      { color: done ? App_Primary_color : textSec },
                      current && { fontFamily: FONTS_FAMILY.Poppins_SemiBold },
                    ]}>
                      {cfg.label}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* ── Products ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.cardTitle, { color: textPrim }]}>
            Items ({order.Products?.length})
          </Text>
          {order.Products?.map((product, idx) => (
            <View
              key={product._id}
              style={[
                styles.productRow,
                idx < order.Products.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderCol, marginBottom: 12, paddingBottom: 12 },
              ]}
            >
              {product.Images?.[0] ? (
                <Image source={{ uri: product.Images[0] }} style={[styles.productImg, { borderColor: borderCol }]} />
              ) : (
                <View style={[styles.productImg, styles.productImgFallback, { borderColor: borderCol }]}>
                  <MaterialCommunityIcons name="image-off-outline" size={22} color="#CCC" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.productName, { color: textPrim }]} numberOfLines={2}>
                  {product.ProductName}
                </Text>
                <Text style={[styles.productMeta, { color: textSec }]}>
                  Qty: {product.Quantity}  •  ₹{product.Price?.toLocaleString('en-IN')} each
                </Text>
              </View>
              <Text style={[styles.productTotal, { color: textPrim }]}>
                ₹{product.TotalPrice?.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Price Breakdown ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.cardTitle, { color: textPrim }]}>Price Details</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: textSec }]}>Subtotal</Text>
            <Text style={[styles.priceValue, { color: textPrim }]}>₹{order.SubTotal?.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: textSec }]}>Shipping</Text>
            <Text style={[styles.priceValue, { color: order.ShippingCharge === 0 ? '#2E7D32' : textPrim }]}>
              {order.ShippingCharge === 0 ? 'FREE' : `₹${order.ShippingCharge?.toLocaleString('en-IN')}`}
            </Text>
          </View>
          <View style={[styles.priceDivider, { backgroundColor: borderCol }]} />
          <View style={styles.priceRow}>
            <Text style={[styles.priceTotalLabel, { color: textPrim }]}>Total</Text>
            <Text style={[styles.priceTotalValue, { color: App_Primary_color }]}>
              ₹{order.TotalAmount?.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* ── Payment Info ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.cardTitle, { color: textPrim }]}>Payment Info</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: textSec }]}>Payment Method</Text>
            <View style={styles.infoValueRow}>
              <MaterialCommunityIcons
                name={order.PaymentMethod === 'COD' ? 'cash' : 'credit-card-outline'}
                size={15}
                color={textPrim}
              />
              <Text style={[styles.infoValue, { color: textPrim }]}>{order.PaymentMethod}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: textSec }]}>Payment Status</Text>
            <View style={[styles.payStatBadge, { backgroundColor: payStat.bg }]}>
              <Text style={[styles.payStatText, { color: payStat.color }]}>{payStat.label}</Text>
            </View>
          </View>
        </View>

        {/* ── Order Meta ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.cardTitle, { color: textPrim }]}>Order Info</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: textSec }]}>Order ID</Text>
            <Text style={[styles.infoValue, { color: textPrim }]}>{order.OrderNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: textSec }]}>Placed On</Text>
            <Text style={[styles.infoValue, { color: textPrim }]}>
              {moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: textSec }]}>Last Updated</Text>
            <Text style={[styles.infoValue, { color: textPrim }]}>
              {moment(order.updatedAt).format('DD MMM YYYY, hh:mm A')}
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:    { flex: 1 },
  loaderText:   { fontSize: 13, fontFamily: FONTS_FAMILY.Poppins_Regular, marginTop: 10 },
  emptyTitle:   { fontSize: 16, fontFamily: FONTS_FAMILY.Poppins_SemiBold, marginTop: 12 },
  goBackBtn:    { marginTop: 16, backgroundColor: App_Primary_color, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  goBackBtnText:{ color: white, fontSize: 14, fontFamily: FONTS_FAMILY.Poppins_SemiBold },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 10 },
  backBtn:      { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle:  { fontSize: 16, fontFamily: FONTS_FAMILY.Poppins_SemiBold },
  headerSub:    { fontSize: 11, fontFamily: FONTS_FAMILY.Poppins_Regular, marginTop: 1 },
  statusBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText:   { fontSize: 11, fontFamily: FONTS_FAMILY.Poppins_SemiBold },

  scrollContent:{ padding: 14 },

  // Card
  card: {
    borderRadius: 14, borderWidth: 1, marginBottom: 12, padding: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  cardTitle:    { fontSize: 14, fontFamily: FONTS_FAMILY.Poppins_SemiBold, marginBottom: 14 },

  // Timeline
  timeline:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  timelineItem: { alignItems: 'center', flex: 1, position: 'relative' },
  timelineLine: { position: 'absolute', top: 12, left: '50%', right: '-50%', height: 2, zIndex: 0 },
  timelineCircle: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center', zIndex: 1, marginBottom: 6 },
  timelineDot:  { width: 6, height: 6, borderRadius: 3 },
  timelineLabel:{ fontSize: 9, fontFamily: FONTS_FAMILY.Poppins_Regular, textAlign: 'center', lineHeight: 13 },

  // Products
  productRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  productImg:   { width: 64, height: 64, borderRadius: 10, borderWidth: 1 },
  productImgFallback: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  productName:  { fontSize: 13, fontFamily: FONTS_FAMILY.Poppins_SemiBold, marginBottom: 4 },
  productMeta:  { fontSize: 11, fontFamily: FONTS_FAMILY.Poppins_Regular },
  productTotal: { fontSize: 14, fontFamily: FONTS_FAMILY.Poppins_Bold },

  // Price
  priceRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  priceLabel:   { fontSize: 13, fontFamily: FONTS_FAMILY.Poppins_Regular },
  priceValue:   { fontSize: 13, fontFamily: FONTS_FAMILY.Poppins_SemiBold },
  priceDivider: { height: 1, marginVertical: 8 },
  priceTotalLabel:{ fontSize: 15, fontFamily: FONTS_FAMILY.Poppins_Bold },
  priceTotalValue:{ fontSize: 16, fontFamily: FONTS_FAMILY.Poppins_Bold },

  // Info rows
  infoRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  infoLabel:    { fontSize: 12, fontFamily: FONTS_FAMILY.Poppins_Regular },
  infoValue:    { fontSize: 12, fontFamily: FONTS_FAMILY.Poppins_SemiBold, maxWidth: '55%', textAlign: 'right' },
  infoValueRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  payStatBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  payStatText:  { fontSize: 11, fontFamily: FONTS_FAMILY.Poppins_SemiBold },
})