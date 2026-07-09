import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  FlatList, Image, ActivityIndicator, Animated,
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

// ─── Filter tabs ──────────────────────────────────────────────────────────────
const FILTERS = [
  { label: 'All',       endpoint: '/api/shop/GetAllMyOrders',            color: '#5C6BC0' },
  { label: 'Placed',    endpoint: '/api/shop/GetAllMyPlacedOrders',      color: '#FF7043' },
  { label: 'Confirmed', endpoint: '/api/shop/GetAllMyConfirmedOrders',   color: '#1E88E5' },
  { label: 'Shipped',   endpoint: '/api/shop/GetAllMyShippedOrders',     color: '#8E24AA' },
  { label: 'Delivered', endpoint: '/api/shop/GetAllMyDeliverdOrders',    color: '#2E7D32' },
  { label: 'Cancelled', endpoint: '/api/shop/GetAllMyCancelledOrders',   color: '#C62828' },
]

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PLACED:    { color: '#FF7043', bg: '#FFF3EE', icon: 'package-variant',          label: 'Placed'    },
  CONFIRMED: { color: '#1E88E5', bg: '#EEF4FF', icon: 'check-circle-outline',      label: 'Confirmed' },
  SHIPPED:   { color: '#8E24AA', bg: '#F5EEF8', icon: 'truck-delivery-outline',    label: 'Shipped'   },
  DELIVERED: { color: '#2E7D32', bg: '#EFF8F1', icon: 'check-decagram-outline',    label: 'Delivered' },
  CANCELLED: { color: '#C62828', bg: '#FEECEC', icon: 'close-circle-outline',      label: 'Cancelled' },
}

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || { color: '#888', bg: '#F5F5F5', icon: 'help-circle-outline', label: status }

// ─────────────────────────────────────────────────────────────────────────────
export default function OrdersScreen({ navigation }) {
  const isFocused              = useSelector ? useIsFocused() : true
  const { isDarkMode }         = useSelector(state => state.theme)
  const [activeFilter, setActiveFilter] = useState(0)
  const [orders, setOrders]    = useState([])
  const [loading, setLoading]  = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropAnim               = useRef(new Animated.Value(0)).current

  // ── Fetch orders ────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (filterIndex) => {
    try {
      setLoading(true)
      const res = await apiGet(FILTERS[filterIndex].endpoint)
      if (res?.data && Array.isArray(res.data)) {
        setOrders(res.data)
      } else {
        setOrders([])
      }
    } catch (e) {
      console.log('fetchOrders error:', e)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isFocused) fetchOrders(activeFilter)
  }, [isFocused, activeFilter])

  // ── Dropdown toggle ─────────────────────────────────────────────────────────
  const toggleDrop = () => {
    const toVal = dropOpen ? 0 : 1
    setDropOpen(!dropOpen)
    Animated.spring(dropAnim, { toValue: toVal, friction: 7, tension: 80, useNativeDriver: false }).start()
  }

  const selectFilter = (idx) => {
    setActiveFilter(idx)
    toggleDrop()
  }

  const dropHeight = dropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FILTERS.length * 46],
  })

  const dropOpacity = dropAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })

  // ── Colors ──────────────────────────────────────────────────────────────────
  const bg        = isDarkMode ? darkMode25 : '#F4F4F8'
  const cardBg    = isDarkMode ? dark33     : '#FFFFFF'
  const textPrim  = isDarkMode ? '#FFFFFF'  : '#111111'
  const textSec   = isDarkMode ? '#AAAAAA'  : '#777777'
  const borderCol = isDarkMode ? '#2A2A2A'  : '#EEEEEE'

  // ── Order Card ──────────────────────────────────────────────────────────────
  const renderOrderCard = useCallback(({ item }) => {
    const status   = getStatusConfig(item.OrderStatus)
    const product  = item.Products?.[0]
    const imgUri   = product?.Images?.[0]
    const extraQty = item.Products?.length - 1

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}
        activeOpacity={0.78}
        onPress={() => navigation.navigate('OrderDetailScreen', { orderId: item._id })}
      >
        {/* ── Top row: order no + status ── */}
        <View style={styles.cardTopRow}>
          <View style={styles.orderNoRow}>
            <MaterialCommunityIcons name="receipt" size={14} color={App_Primary_color} />
            <Text style={[styles.orderNo, { color: App_Primary_color }]}>{item.OrderNumber}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <MaterialCommunityIcons name={status.icon} size={12} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        {/* ── Product row ── */}
        <View style={styles.productRow}>
          {imgUri ? (
            <Image source={{ uri: imgUri }} style={[styles.productImg, { borderColor: borderCol }]} />
          ) : (
            <View style={[styles.productImg, styles.productImgFallback, { borderColor: borderCol }]}>
              <MaterialCommunityIcons name="image-off-outline" size={22} color="#CCC" />
            </View>
          )}
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: textPrim }]} numberOfLines={1}>
              {product?.ProductName || '—'}
            </Text>
            <Text style={[styles.productMeta, { color: textSec }]}>
              Qty: {product?.Quantity}  •  ₹{product?.TotalPrice?.toLocaleString('en-IN')}
            </Text>
            {extraQty > 0 && (
              <Text style={[styles.moreItems, { color: App_Primary_color }]}>
                +{extraQty} more item{extraQty > 1 ? 's' : ''}
              </Text>
            )}
          </View>
          <View style={styles.amountBlock}>
            <Text style={[styles.totalAmt, { color: textPrim }]}>
              ₹{item.TotalAmount?.toLocaleString('en-IN')}
            </Text>
            <Text style={[styles.payMethod, { color: textSec }]}>{item.PaymentMethod}</Text>
          </View>
        </View>

        {/* ── Bottom row: date + arrow ── */}
        <View style={[styles.cardBottomRow, { borderTopColor: borderCol }]}>
          <Ionicons name="time-outline" size={12} color={textSec} />
          <Text style={[styles.dateText, { color: textSec }]}>
            {moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[styles.viewDetail, { color: App_Primary_color }]}>View Details</Text>
          <Ionicons name="chevron-forward" size={14} color={App_Primary_color} />
        </View>
      </TouchableOpacity>
    )
  }, [isDarkMode])

  // ── Empty ───────────────────────────────────────────────────────────────────
  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="package-variant-closed" size={72} color={isDarkMode ? '#444' : '#DDD'} />
      <Text style={[styles.emptyTitle, { color: textPrim }]}>No Orders Found</Text>
      <Text style={[styles.emptySubtitle, { color: textSec }]}>
        You have no {FILTERS[activeFilter].label.toLowerCase()} orders yet.
      </Text>
    </View>
  ), [isDarkMode, activeFilter])

  // ── Main ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderCol }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={textPrim} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textPrim }]}>My Orders</Text>

        {/* ── Dropdown trigger ── */}
        <TouchableOpacity
          style={[styles.dropTrigger, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F0F0F5', borderColor: borderCol }]}
          onPress={toggleDrop}
          activeOpacity={0.8}
        >
          <View style={[styles.dropDot, { backgroundColor: FILTERS[activeFilter].color }]} />
          <Text style={[styles.dropTriggerText, { color: textPrim }]}>{FILTERS[activeFilter].label}</Text>
          <Ionicons
            name={dropOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={textSec}
          />
        </TouchableOpacity>
      </View>

      {/* ── Dropdown menu ── */}
      <Animated.View
        style={[
          styles.dropdown,
          {
            height: dropHeight,
            opacity: dropOpacity,
            backgroundColor: cardBg,
            borderColor: borderCol,
          },
        ]}
      >
        {FILTERS.map((f, idx) => (
          <TouchableOpacity
            key={f.label}
            style={[
              styles.dropItem,
              { borderBottomColor: borderCol },
              idx === activeFilter && { backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7FC' },
            ]}
            onPress={() => selectFilter(idx)}
            activeOpacity={0.75}
          >
            <View style={[styles.dropDot, { backgroundColor: f.color }]} />
            <Text style={[
              styles.dropItemText,
              { color: idx === activeFilter ? f.color : textPrim },
              idx === activeFilter && { fontFamily: FONTS_FAMILY.Poppins_SemiBold },
            ]}>
              {f.label}
            </Text>
            {idx === activeFilter && (
              <Ionicons name="checkmark" size={15} color={f.color} style={{ marginLeft: 'auto' }} />
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* ── Backdrop to close dropdown ── */}
      {dropOpen && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={toggleDrop}
          activeOpacity={1}
        />
      )}

      {/* ── List ── */}
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={App_Primary_color} />
          <Text style={[styles.loaderText, { color: textSec }]}>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderCard}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:    { flex: 1 },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 10 },
  backBtn:      { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle:  { flex: 1, fontSize: 17, fontFamily: FONTS_FAMILY.Poppins_SemiBold },
  dropTrigger:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  dropTriggerText: { fontSize: 12, fontFamily: FONTS_FAMILY.Poppins_Medium },
  dropDot:      { width: 8, height: 8, borderRadius: 4 },

  // Dropdown
  dropdown:     { overflow: 'hidden', borderBottomWidth: 1, zIndex: 99 },
  dropItem:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1 },
  dropItemText: { fontSize: 14, fontFamily: FONTS_FAMILY.Poppins_Regular },

  // List
  listContent:  { padding: 14, paddingBottom: 30 },
  loaderWrap:   { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loaderText:   { fontSize: 13, fontFamily: FONTS_FAMILY.Poppins_Regular },

  // Card
  card: {
    borderRadius: 14, borderWidth: 1, marginBottom: 12,
    overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  cardTopRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 },
  orderNoRow:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  orderNo:      { fontSize: 12, fontFamily: FONTS_FAMILY.Poppins_SemiBold },
  statusBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText:   { fontSize: 11, fontFamily: FONTS_FAMILY.Poppins_SemiBold },

  productRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 12, gap: 12 },
  productImg:   { width: 64, height: 64, borderRadius: 10, borderWidth: 1 },
  productImgFallback: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  productInfo:  { flex: 1 },
  productName:  { fontSize: 14, fontFamily: FONTS_FAMILY.Poppins_SemiBold, marginBottom: 3 },
  productMeta:  { fontSize: 12, fontFamily: FONTS_FAMILY.Poppins_Regular },
  moreItems:    { fontSize: 11, fontFamily: FONTS_FAMILY.Poppins_Medium, marginTop: 3 },
  amountBlock:  { alignItems: 'flex-end' },
  totalAmt:     { fontSize: 15, fontFamily: FONTS_FAMILY.Poppins_Bold },
  payMethod:    { fontSize: 11, fontFamily: FONTS_FAMILY.Poppins_Regular, marginTop: 2 },

  cardBottomRow:{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderTopWidth: 1 },
  dateText:     { fontSize: 11, fontFamily: FONTS_FAMILY.Poppins_Regular },
  viewDetail:   { fontSize: 12, fontFamily: FONTS_FAMILY.Poppins_Medium },

  // Empty
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyTitle:   { fontSize: 16, fontFamily: FONTS_FAMILY.Poppins_SemiBold },
  emptySubtitle:{ fontSize: 13, fontFamily: FONTS_FAMILY.Poppins_Regular, textAlign: 'center', paddingHorizontal: 30 },
})