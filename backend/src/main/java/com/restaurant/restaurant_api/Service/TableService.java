package com.restaurant.restaurant_api.Service;


import com.restaurant.restaurant_api.Model.Table;
import com.restaurant.restaurant_api.Repository.TableRepository;
import com.restaurant.restaurant_api.Repository.WaiterRepository;
import com.restaurant.restaurant_api.Validation;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TableService {

    private final TableRepository tableRepository;
    private final WaiterRepository waiterRepository;
    private final Validation validation;

    public TableService(TableRepository tableRepository, Validation validation, WaiterRepository waiterRepository) {
        this.tableRepository = tableRepository;
        this.validation = validation;
        this.waiterRepository = waiterRepository;
    }
    public List<Table> getAllTables() {
        return getTableRepository().findAll();
    }

    public List<Table> getTableByWaiterId(int tableWaiterId) {
        if (getValidation().isIdValid(tableWaiterId)) {
            return getTableRepository().findByTableWaiterEmployeeId(tableWaiterId);
        }
        throw new IllegalArgumentException("tableWaiterId cannot be equal or lower than 0");
    }

    public List<Table> getTableById(int tableId) {
        if (getValidation().isIdValid(tableId)) {
            Table table = getTableRepository().findById(tableId);
            if (table == null) throw new NoSuchElementException("table is not found");
            return List.of(table);
        }
        throw new IllegalArgumentException("tableId cannot be equal or lower than 0");
    }

    public Table postTable(Table table) {
        if (table.getTableWaiter() != null) {
            if (getWaiterRepository().existsById(table.getTableWaiter().getEmployeeId())) {
                return getTableRepository().save(table);
            }
            throw new NoSuchElementException("waiter is not found");
        }
        return getTableRepository().save(table);
    }

    public void deleteTableById(int tableId) {
        if (getValidation().isIdValid(tableId)) {
            if (getTableRepository().existsById(tableId)) {
                getTableRepository().deleteById(tableId);
                return;
            }
            throw new NoSuchElementException("table is not found");
        }
        throw new IllegalArgumentException("tableId cannot be equal or lower than 0");
    }

    public void deleteByTableWaiterId(int tableWaiterId) {
        if (getValidation().isIdValid(tableWaiterId)) {
            if (getTableRepository().existsByTableWaiterEmployeeId(tableWaiterId)) {
                getTableRepository().deleteById(tableWaiterId);
                return;
            }
            throw new NoSuchElementException("waiter is not found");
        }
        throw new IllegalArgumentException("tableWaiterId cannot be equal or lower than 0");
    }

    public Table putByTableId(int tableId, Table table) {
        if (getValidation().isIdValid(tableId)) {
            Table oldTable = getTableRepository().findById(tableId);
            if (oldTable != null) {
                oldTable.setTableAvailable(table.isTableAvailable());
                oldTable.setTableTotalCost(table.getTableTotalCost());
                if (table.getTableWaiter() != null) {
                    if (getValidation().isIdValid(table.getTableWaiter().getEmployeeId())) {
                        if (getWaiterRepository().existsById(table.getTableWaiter().getEmployeeId())) {
                            oldTable.setTableWaiter(table.getTableWaiter());
                            return getTableRepository().save(oldTable);
                        }
                        throw new NoSuchElementException("waiter is not found");
                    }
                    throw new IllegalArgumentException("tableWaiterId cannot be equal or lower than 0");
                }
                oldTable.setTableWaiter(table.getTableWaiter());
                return getTableRepository().save(oldTable);
            }
            throw new NoSuchElementException("table is not found");
        }
        throw new IllegalArgumentException("tableId cannot be equal or lower than 0");
    }

    public TableRepository getTableRepository() {
        return tableRepository;
    }

    public WaiterRepository getWaiterRepository() {
        return waiterRepository;
    }

    public Validation getValidation() {
        return validation;
    }
}
