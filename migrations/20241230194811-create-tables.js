'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar tabela fazendas
    await queryInterface.createTable('fazendas', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      localizacao: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: true,
      },
      area_total: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela usuarios
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      fazenda_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'fazendas',
          key: 'id',
        },
      },
      ds_tipo_documento: {
        type: Sequelize.ENUM('CPF', 'CNPJ'),
        allowNull: false,
      },
      nu_documento: {
        type: Sequelize.STRING(14),
        allowNull: false,
      },
      ds_nome_completo: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ds_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      ds_senha: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      codigo_verificacao: {
        type: Sequelize.STRING(6),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela funcionarios
    await queryInterface.createTable('funcionarios', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      cargo: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      salario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      fazenda_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'fazendas',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela plantacoes
    await queryInterface.createTable('plantacoes', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      fazenda_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'fazendas',
          key: 'id',
        },
      },
      usuario_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
      },
      ds_nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ds_descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.createTable('arvores', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      plantacoes_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'plantacoes',
          key: 'id'
        }
      },
      ds_nome: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      ds_descricao: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      dt_plantio: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isBefore: new Date().toISOString(), // Garante que a data não seja futura
        }
      },
      status: {
        type: Sequelize.ENUM('Plantada', 'Vingou', 'Não Vingou', 'Produzindo'),
        allowNull: true
      },
      localizacao: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
      },
      qt_extracoes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      vl_total_extracoes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      md_frutos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      md_tempo_extracoes: {
        type: Sequelize.FLOAT, // Armazena a média em dias
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
    }),

    // Criar tabela periodos
    await queryInterface.createTable('periodos', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      plantacoes_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'plantacoes',
          key: 'id',
        },
      },
      tipo: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      dt_inicio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dt_fim: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela extracoes
    await queryInterface.createTable('extracoes', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      arvores_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'arvores',
          key: 'id',
        },
      },
      vl_volume: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela servicos
    await queryInterface.createTable('servicos', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      descricao: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      custo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      data_execucao: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      fazenda_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'fazendas',
          key: 'id',
        },
      },
      funcionario_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'funcionarios',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover tabelas na ordem inversa para respeitar dependências
    await queryInterface.dropTable('servicos');
    await queryInterface.dropTable('extracoes');
    await queryInterface.dropTable('periodos');
    await queryInterface.dropTable('plantacoes');
    await queryInterface.dropTable('funcionarios');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('fazendas');
  },
};
