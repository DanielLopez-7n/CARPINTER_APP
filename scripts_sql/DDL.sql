USE carpinter_db;

CREATE TABLE IF NOT EXISTS lista_precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(50) NOT NULL,
    codigo_vendedor BIGINT NOT NULL,
    precio_especial DECIMAL(12, 2) NOT NULL,
    
    FOREIGN KEY (codigo_producto) REFERENCES productos(codigo) ON DELETE CASCADE,
    FOREIGN KEY (codigo_vendedor) REFERENCES vendedores(codigo) ON DELETE CASCADE
);