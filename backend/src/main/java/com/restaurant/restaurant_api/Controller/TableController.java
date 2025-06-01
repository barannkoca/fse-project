package com.restaurant.restaurant_api.Controller;

import com.restaurant.restaurant_api.Model.Table;
import com.restaurant.restaurant_api.Service.TableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/Tables")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public ResponseEntity<List<Table>> getTables(
            @RequestParam(required = false) Integer tableId,
            @RequestParam(required = false) Integer tableWaiterId
    ) {
        if (tableId == null && tableWaiterId == null) {
            return new ResponseEntity<>(getTableService().getAllTables(), HttpStatus.OK);
        }
        else if (tableId == null) {
            return new ResponseEntity<>(getTableService().getTableByWaiterId(tableWaiterId), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(getTableService().getTableById(tableId), HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<Table> postATable(@RequestBody Table table) {
        if (table != null) {
            return new ResponseEntity<>(getTableService().postTable(table), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new Table(), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{tableId}")
    public ResponseEntity<Void> deleteATable(@PathVariable int tableId) {
        getTableService().deleteTableById(tableId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/byWaiter/{waiterId}")
    public ResponseEntity<Void> deleteTablesByWaiter(@PathVariable int tableWaiterId) {
        getTableService().deleteByTableWaiterId(tableWaiterId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{tableId}")
    public ResponseEntity<Table> putATable(@PathVariable int tableId, @RequestBody Table table) {
        if (table != null) {
            return new ResponseEntity<>(getTableService().putByTableId(tableId, table), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new Table(), HttpStatus.BAD_REQUEST);
    }

    public TableService getTableService() {
        return tableService;
    }
}
