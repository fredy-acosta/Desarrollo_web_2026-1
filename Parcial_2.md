# Creación de base de datos en DBeaver en MySQL y PostgreSQL

## MySQL

![DBeaver MySQL - Paso 1](image1.png)

![DBeaver MySQL - Paso 2](imagenes/image2.png)

## PostgreSQL

![DBeaver PostgreSQL - Paso 1](imagenes/image3.png)

![DBeaver PostgreSQL - Paso 2](imagenes/image4.png)

---

## Ahora Creación de modelos

Este fue el prompt que usé para la creación de los modelos:

> créame los modelos de Node.js con relaciones incluidas (no hagas relaciones circulares por favor) adaptados al siguiente ejemplo, todos los modelos deben correr en cualquiera de los 4 motores (oracle, mysql, sql server, postgres) y deben tener un status para seleccionar active o inactive, esto para manejar el borrado lógico, los crearás en inglés y con I mayúscula al final, cuando haya una relación de muchos a muchos, crea una tabla puente donde solo lleguen ambos ids y el campo de status, las relaciones no las hagas por medio de un archivo associations, ah y también agrégale validaciones y restricciones, las quiero tal como en el ejemplo:

```typescript
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import bcrypt from 'bcryptjs';
import { Sale } from "./Sale";

export interface ClientI {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  status: "ACTIVE" | "INACTIVE";
}

export class Client extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Client.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Phone cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: { msg: "Email must be a valid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "clients",
    timestamps: false,
    hooks: {
      beforeCreate: async (client: Client) => {
        if (client.password) {
          const salt = await bcrypt.genSalt(10);
          client.password = await bcrypt.hash(client.password, salt);
        }
      },
      beforeUpdate: async (client: Client) => {
        if (client.password) {
          const salt = await bcrypt.genSalt(10);
          client.password = await bcrypt.hash(client.password, salt);
        }
      }
    }
  }
);

Client.hasMany(Sale, {
  foreignKey: "client_id",
  sourceKey: "id",
});
Sale.belongsTo(Client, {
  foreignKey: "client_id",
  targetKey: "id",
});
```

### CarI.ts

![CarI.ts - Parte 1](imagenes/image5.png)

![CarI.ts - Parte 2](imagenes/image6.png)

![CarI.ts - Parte 3](imagenes/image7.png)

![CarI.ts - Parte 4](imagenes/image8.png)

![CarI.ts - Parte 5](imagenes/image9.png)

![CarI.ts - Parte 6](imagenes/image10.png)

### TuitionI.ts

![TuitionI.ts - Parte 1](imagenes/image11.png)

![TuitionI.ts - Parte 2](imagenes/image12.png)

![TuitionI.ts - Parte 3](imagenes/image13.png)

![TuitionI.ts - Parte 4](imagenes/image14.png)

---

## Creación de los controladores

Este fue el prompt que usé para crear los controladores:

> hazme los controladores de mis modelos en base a este ejemplo, ten en cuenta que ahora los archivos de controladores se llaman `modelo.controller.ts`, ejemplo: `client.controller.ts`

```typescript
import { Request, Response } from "express";
import { Client, ClientI } from "../models/persons/Client";

export class ClientController {
  public async getAllClients(req: Request, res: Response) {
    try {
      const clients: ClientI[] = await Client.findAll({ where: { status: "ACTIVE" } });
      res.status(200).json({ clients });
    } catch (error) {
      res.status(500).json({ error: "Error fetching clients" });
    }
  }

  public async getClientById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const client = await Client.findOne({ where: { id: pk, status: "ACTIVE" } });
      if (client) {
        res.status(200).json({ client });
      } else {
        res.status(404).json({ error: "Client not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching client" });
    }
  }

  public async createClient(req: Request, res: Response) {
    const { doc_type, doc_number, name, phone, email, status } = req.body;
    try {
      const body: ClientI = { doc_type, doc_number, name, phone, email, status };
      const newClient = await Client.create({ ...body });
      res.status(201).json(newClient);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async updateClient(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { doc_type, doc_number, name, phone, email, status } = req.body;
    try {
      const body: ClientI = { doc_type, doc_number, name, phone, email, status };
      const clientExist = await Client.findOne({ where: { id: pk, status: "ACTIVE" } });
      if (clientExist) {
        await clientExist.update(body, { where: { id: pk } });
        res.status(200).json(clientExist);
      } else {
        res.status(404).json({ error: "Client not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async deleteClient(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const clientToDelete = await Client.findOne({ where: { id: pk } });
      if (clientToDelete) {
        await clientToDelete.destroy();
        res.status(200).json({ message: "Client deleted successfully" });
      } else {
        res.status(404).json({ error: "Client not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting client" });
    }
  }

  public async deleteClientAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const clientToUpdate = await Client.findOne({ where: { id: pk, status: "ACTIVE" } });
      if (clientToUpdate) {
        await clientToUpdate.update({ status: "INACTIVE" });
        res.status(200).json({ message: "Client marked as inactive" });
      } else {
        res.status(404).json({ error: "Client not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking client as inactive" });
    }
  }
}
```

### Car.controller.ts

![Car.controller.ts - Parte 1](imagenes/image15.png)

![Car.controller.ts - Parte 2](imagenes/image16.png)

![Car.controller.ts - Parte 3](imagenes/image17.png)

![Car.controller.ts - Parte 4](imagenes/image18.png)

### Tuition.controller.ts

![Tuition.controller.ts - Parte 1](imagenes/image19.png)

![Tuition.controller.ts - Parte 2](imagenes/image20.png)

![Tuition.controller.ts - Parte 3](imagenes/image21.png)

![Tuition.controller.ts - Parte 4](imagenes/image22.png)

---

## Creación de las rutas

Este fue el prompt usado para la creación de las rutas:

> ahora créame las rutas de mis modelos adaptadas al siguiente ejemplo, ten en cuenta que las rutas no son `modelo.route.ts`, solo `modelo.ts`

```typescript
import { Application } from "express";
import { CategoryController } from "../controllers/inventories/category.controller";

export class CategoryRoutes {
  public controller = new CategoryController();

  public routes(app: Application): void {
    app.route("/api/category/public")
      .get(this.controller.getAllCategories)
      .post(this.controller.createCategory);

    app.route("/api/category/public/:id")
      .get(this.controller.getCategoryById)
      .patch(this.controller.updateCategory)
      .delete(this.controller.deleteCategory);

    app.route("/api/category/public/:id/logic")
      .delete(this.controller.deleteCategoryAdv);
  }
}
```

### Car.ts (rutas)

![Car.ts rutas](imagenes/image23.png)

![Car.ts rutas - Parte 2](imagenes/image24.png)

### Tuition.ts (rutas)

![Tuition.ts rutas](imagenes/image25.png)

---

## Después de esto creamos las tablas en físico en DBeaver

![Tablas en DBeaver](imagenes/image26.png)

---

## Creé el faker

Este fue el prompt para crear el faker:

> en la carpeta faker, creé un archivo llamado `populate_data.ts`, este será para crear datos falsos, llénalo y haz que al ejecutar `ts-node src/faker/populate_data.ts` funcione en base a este ejemplo:

```typescript
import { Client } from '../models/Client';
import { ProductType } from '../models/ProductType';
import { Product } from '../models/Product';
import { Sale } from '../models/Sale';
import { ProductSale } from '../models/ProductSale';
import { faker } from '@faker-js/faker';

async function createFakeData() {
  // Crear clientes falsos
  for (let i = 0; i < 50; i++) {
    await Client.create({
      name: faker.person.fullName(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      status: 'ACTIVE',
    });
  }

  // Crear tipos de productos falsos
  for (let i = 0; i < 10; i++) {
    await ProductType.create({
      name: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      status: 'ACTIVE',
    });
  }

  // Crear productos falsos
  const typeProducts = await ProductType.findAll();
  for (let i = 0; i < 20; i++) {
    await Product.create({
      name: faker.commerce.productName(),
      brand: faker.company.name(),
      price: faker.number.bigInt(),
      min_stock: faker.number.int({ min: 1, max: 10 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      product_type_id: typeProducts.length > 0
        ? typeProducts[faker.number.int({ min: 0, max: typeProducts.length - 1 })]?.id
        : null,
      status: 'ACTIVE',
    });
  }

  // Crear ventas falsas
  const clients = await Client.findAll();
  for (let i = 0; i < 100; i++) {
    await Sale.create({
      sale_date: faker.date.past(),
      subtotal: faker.number.bigInt(),
      tax: faker.number.bigInt(),
      discounts: faker.number.bigInt(),
      total: faker.number.bigInt(),
      status: 'ACTIVE',
      client_id: clients.length > 0
        ? clients[faker.number.int({ min: 0, max: clients.length - 1 })]?.id ?? null
        : null
    });
  }

  // Crear productos ventas falsos
  const sales = await Sale.findAll();
  const products = await Product.findAll();
  for (let i = 0; i < 200; i++) {
    await ProductSale.create({
      total: faker.number.bigInt(),
      sale_id: sales[faker.number.int({ min: 0, max: sales.length - 1 })]?.id ?? null,
      product_id: products[faker.number.int({ min: 0, max: products.length - 1 })]?.id ?? null
    });
  }
}

createFakeData().then(() => {
  console.log('Datos falsos creados exitosamente');
}).catch((error) => {
  console.error('Error al crear datos falsos:', error);
});
```

### faker.ts

![faker.ts - Parte 1](imagenes/image27.png)

![faker.ts - Parte 2](imagenes/image28.png)
