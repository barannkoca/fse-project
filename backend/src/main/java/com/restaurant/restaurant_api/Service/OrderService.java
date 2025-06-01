package com.restaurant.restaurant_api.Service;

import com.restaurant.restaurant_api.Model.MenuItem;
import com.restaurant.restaurant_api.Model.Order;
import com.restaurant.restaurant_api.Repository.CardRepository;
import com.restaurant.restaurant_api.Repository.MenuItemRepository;
import com.restaurant.restaurant_api.Repository.OrderRepository;
import com.restaurant.restaurant_api.Repository.TableRepository;
import com.restaurant.restaurant_api.Validation;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;
    private final CardRepository cardRepository;
    private final Validation validation;

    public OrderService(OrderRepository orderRepository,
                        TableRepository tableRepository,
                        MenuItemRepository menuItemRepository,
                        CardRepository cardRepository,
                        Validation validation) {
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
        this.menuItemRepository = menuItemRepository;
        this.cardRepository = cardRepository;
        this.validation = validation;
    }

    public List<Order> getAllOrders() {
        return getOrderRepository().findAll();
    }

    public List<Order> getOrderByTableId(int orderTableId) {
        if (getValidation().isIdValid(orderTableId)) {
            return getOrderRepository().findByOrderTableTableId(orderTableId);
        }
        throw new IllegalArgumentException("orderTableId cannot be equal or lower than 0");
    }

    public List<Order> getOrderById(int orderId) {
        if (getValidation().isIdValid(orderId)) {
            Order order = getOrderRepository().findById(orderId);
            if (order == null) throw new NoSuchElementException("order is not found");
            return List.of(order);
        }
        throw new IllegalArgumentException("orderId cannot be equal or lower than 0");
    }

    public Order postOrder(Order order) {
        if (order.getOrderCard() != null && order.getOrderTable() != null) {
            if (getCardRepository().existsById(order.getOrderCard().getCardId()) &&
                getTableRepository().existsById(order.getOrderTable().getTableId())
            ) {
                for (MenuItem menuItem : order.getOrderMenuItems()) {
                    if (!getMenuItemRepository().existsById(menuItem.getMenuItemId())) {
                        throw new NoSuchElementException("menuItem is not found");
                    }
                }
                return getOrderRepository().save(order);
            }
            throw new NoSuchElementException("table or card are not found");
        }
        throw new IllegalArgumentException("orderTable and orderCard cannot be null");
    }

    public void deleteOrderById(int orderId) {
        if (getValidation().isIdValid(orderId)) {
            if (getOrderRepository().existsById(orderId)) {
                getOrderRepository().deleteById(orderId);
                return;
            }
            throw new NoSuchElementException("order is not found");
        }
        throw new IllegalArgumentException("orderId cannot be equal or lower than 0");
    }

    public void deleteByOrderTableId(int orderTableId) {
        if (getValidation().isIdValid(orderTableId)) {
            if (getOrderRepository().existsByOrderTableTableId(orderTableId)) {
                getOrderRepository().deleteByOrderTableTableId(orderTableId);
                return;
            }
        }
        throw new IllegalArgumentException("orderTableId cannot be equal or lower than 0");
    }

    public Order putByOrderId(int orderId, Order order) {
        if (getValidation().isIdValid(orderId)) {
            Order oldOrder = getOrderRepository().findById(orderId);
            if (oldOrder != null) {
                if (order.getOrderCard() != null && order.getOrderTable() != null) {
                    if (getCardRepository().existsById(order.getOrderCard().getCardId()) &&
                            getTableRepository().existsById(order.getOrderTable().getTableId())
                    ) {
                        for (MenuItem menuItem : order.getOrderMenuItems()) {
                            if (!getMenuItemRepository().existsById(menuItem.getMenuItemId())) {
                                throw new NoSuchElementException("menuItem is not found");
                            }
                        }
                        oldOrder.setOrderCard(order.getOrderCard());
                        oldOrder.setOrderPrice(order.getOrderPrice());
                        oldOrder.setOrderStatue(order.getOrderStatue());
                        oldOrder.setOrderTable(order.getOrderTable());
                        oldOrder.setOrderMenuItems(order.getOrderMenuItems());
                        return getOrderRepository().save(oldOrder);
                    }
                    throw new NoSuchElementException("table or card are not found");
                }
                throw new IllegalArgumentException("orderTable and orderCard cannot be null");
            }
            throw new NoSuchElementException("order is not found");
        }
        throw new IllegalArgumentException("orderId cannot be equal or lower than 0");
    }

    public OrderRepository getOrderRepository() {
        return orderRepository;
    }

    public TableRepository getTableRepository() {
        return tableRepository;
    }

    public MenuItemRepository getMenuItemRepository() {
        return menuItemRepository;
    }

    public CardRepository getCardRepository() {
        return cardRepository;
    }

    public Validation getValidation() {
        return validation;
    }
}
