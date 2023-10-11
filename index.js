import inquirer from "inquirer"
import chalk from "chalk"

import fs from "fs"

operacao()
function operacao(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: ['Criar conta', 'Entrar', 'Sair']
        }
    ]).then((resposta) =>{
        const action = resposta['action']

        if(action === 'Criar conta'){
            criando_conta()
        }else if(action === 'Entrar'){
            login()
        }else if(action === 'Sair'){
            console.log(chalk.bgCyan(' Obrigado por usar a conta '))
            process.exit()
        }
    })
    .catch(err =>{
        console.log(err)
    })
}

//criando a conta
function criando_conta(){
    console.log(chalk.bgCyan.black(' Parabéns por escolher nosso banco '))
    construindo_conta()
}

// construindo a conta
function construindo_conta(){
  
    inquirer.prompt([
        {
            name: 'nome_conta', 
            message: 'Digite um nome para sua conta: '
        },
        {
            name: 'senha_conta',
            message: 'Digite uma senha para sua conta: ',
        }
    ]).then((resposta) =>{
        const nome_conta = resposta['nome_conta']
        const senha_conta = resposta['senha_conta']

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${nome_conta}.json`)){
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            return construindo_conta()
        }

        const accountData = {
            balance: 0,
            senha: senha_conta 
        }

        fs.writeFileSync(`accounts/${nome_conta}.json`,JSON.stringify(accountData, null, 2), function (err){
            console.log(err)
        })

        console.log(chalk.green('Sua conta foi criada com sucesso!!!'))

        menu(nome_conta)

    }).catch(err =>{
        console.log(err)
    })
}

// efetuando login
function login(){
    inquirer.prompt([
        {
            name: 'nome_conta',
            message: 'Digite o nome da sua conta: '

        },
        {
            name: 'senha_conta',
            message: 'Digite sua senha: ',
        }
    ]).then(resposta => {
        const nome_conta = resposta['nome_conta']
        const senha_conta = resposta['senha_conta']

        if(checkAccount(nome_conta, senha_conta)){
            return login()
        }

        menu(nome_conta)
        
    }).catch(err =>{
        console.log(err)
    })
}

// checando se conta existe
function checkAccount(nome_conta, senha_conta){

    let ler_senha
    let senha

    if(fs.existsSync(`accounts/${nome_conta}.json`)){
        ler_senha = fs.readFileSync(`accounts/${nome_conta}.json`, 'utf8')
        // Analisa o conteúdo do arquivo JSON
        const objetoJSON = JSON.parse(ler_senha);
      
        // Acesse o valor da chave "idade"
        senha = objetoJSON.senha;
    }

    if(!fs.existsSync(`accounts/${nome_conta}.json`)){
        console.log(chalk.bgRed.black(' Esta conta não existe,  tente novamente '))
        return true
    }

    if(senha != senha_conta){
        console.log(chalk.bgRed.black('Esta senha não existe, tente novamente!!!'))
        return true
    }

    return false
}

// menu da conta
function menu(nome_conta){
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: ' O que você deseja fazer? ',
            choices: ['Consultar Saldo', 'Transferencia', 'Depositar', 'Sacar', 'Sair', 'Deletar Conta']

        }
    ]).then((resposta)=>{
        const menu = resposta['menu']
        if(menu === 'Consultar Saldo'){
            getAccountBalance(nome_conta)
        }else if(menu === 'Transferencia'){
            transferencia(nome_conta)
        }else if(menu === 'Depositar'){
            deposit(nome_conta)
        }else if(menu === 'Sacar'){
            withdraw(nome_conta)
        }else if(menu === 'Sair'){
            console.log(chalk.bgBlue.black(' Obrigado por usar a conta '))
            process.exit()
        }else if(menu === 'Deletar Conta'){
            delete_account(nome_conta)
        }
        
    }).catch((err)=>{
        console.log(err)
    })
}

// depositar
function deposit(nome_conta){

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            },
            {
                name: 'senha_conta',
                message: 'Digite sua senha: ',
            }
        ]).then(resposta =>{

            const amount = resposta['amount']
            const senha_conta = resposta['senha_conta']

            if(checkAccount(nome_conta, senha_conta)){
                return deposit(nome_conta)
            }

            //add an amount
            addAmount(nome_conta, amount)
            //menu(nome_conta)
        })
        .catch(err =>{console.log(err)})
    }

//adicionando quantia
function addAmount(nome_conta,amount){
    const accountData = getAccount(nome_conta)
    
    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit(nome_conta)
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`accounts/${nome_conta}.json`, 
    JSON.stringify(accountData, null, 2), function (err){
        console.log(err)
    })

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`))

    menu(nome_conta)
}

function getAccount(nome_conta){
    const accountJSON = fs.readFileSync(`accounts/${nome_conta}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)

}

// consultar saldo
function getAccountBalance(nome_conta){
    inquirer.prompt([
        {
            name:'senha_conta',
            message: 'Digite sua senha: '
        }
    ]).then((resposta) =>{
        const senha_conta = resposta['senha_conta']

        //verify if account exists
        if(checkAccount(nome_conta, senha_conta)){
            return getAccountBalance(nome_conta)
        }

        const accountData = getAccount(nome_conta)

        console.log(chalk.bgBlue.black(` Olá, o saldo da sua conta é de R$${accountData.balance} `))
      
        menu(nome_conta)
    }).catch((err)=>{
        console.log(err)
    })
}

//sacar
function withdraw(nome_conta){
    
        inquirer.prompt([
            {
                name:'amount',
                message: 'Quanto você deseja sacar?'
            },
            {
                name:'senha_conta',
                message: 'Digite sua senha: '
            }
        ]).then((resposta) =>{

            const amount = resposta['amount']
            const senha_conta = resposta['senha_conta']

            if(checkAccount(nome_conta, senha_conta)){
                return withdraw(nome_conta)
            }

            removAmount(nome_conta, amount)
            

        }).catch((err)=>{console.log(err)})


}

function removAmount(nome_conta, amount){
    const accountData = getAccount(nome_conta)

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'))
        return withdraw(nome_conta)
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponivel!'))
        return withdraw(nome_conta)
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(`accounts/${nome_conta}.json`, 
    JSON.stringify(accountData, null, 2), function (err){
        console.log(err)
    })

    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta`))

    menu(nome_conta)
}

//deletar conta
function delete_account(nome_conta){
    inquirer.prompt([
        {
            name:'senha_conta',
            message: 'Digite sua senha: '
        }
    ]).then(resposta =>{
        const senha_conta = resposta['senha_conta']

        if(checkAccount(nome_conta, senha_conta)){
            return delete_account(nome_conta)
        }
        fs.unlinkSync(`accounts/${nome_conta}.json`);
        console.log(chalk.red('Conta deletada'))
    }).catch(err =>{
        console.log(err)
    })

    
}

// função de transferencia bancaria

function transferencia(nome_conta){
    inquirer.prompt([
        {
            name: 'conta_da_transferencia',
            message: 'Digite o nome da conta que deseja fazer a transferência: '
        },
        {
            name: 'valor_da_transferencia',
            message: 'Quanto deseja transferir: '
        },
        {
            name: 'nome_senha',
            message: 'Digite sua senha para efetuar a transferência: '
        }
    ]).then(resposta =>{
        const conta_da_transferencia = resposta['conta_da_transferencia']
        const valor_da_transferencia = resposta['valor_da_transferencia']
        const nome_senha = resposta['nome_senha']

        if(conta_da_transferencia == nome_conta){
            console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!!!'))
            return transferencia(nome_conta)
        }

        if(checando_conta(conta_da_transferencia)){
            return transferencia(nome_conta)
        }

        if(checkAccount(nome_conta, nome_senha)){
            return transferencia(nome_conta)
        }

        realizando_trasnferencia(conta_da_transferencia, valor_da_transferencia, nome_conta)
    }).catch(err=>{
        console.log(err)
    })
}


function realizando_trasnferencia(conta_da_transferencia, valor_da_transferencia, nome_conta){
    const accountData = getAccount(conta_da_transferencia)
    const accountPessoal = getAccount(nome_conta)

    if(!valor_da_transferencia) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!!!'))
        return transferencia(nome_conta)
    }

    if(accountPessoal.balance < valor_da_transferencia){
        console.log(chalk.bgRed.black('Valor indisponivel!'))
        return transferencia(nome_conta)
    }

    accountData.balance = parseFloat(accountData.balance) + parseFloat(valor_da_transferencia)
    accountPessoal.balance = parseFloat(accountPessoal.balance) - parseFloat(valor_da_transferencia)

    fs.writeFileSync(`accounts/${conta_da_transferencia}.json`, 
    JSON.stringify(accountData, null, 2), function (err){
        console.log(err)
    })

    fs.writeFileSync(`accounts/${nome_conta}.json`, 
    JSON.stringify(accountPessoal, null, 2), function (err){
        console.log(err)
    })

    console.log(chalk.green(`Tranferência para a conta ${conta_da_transferencia} de R$${valor_da_transferencia} realizada!!!`))

    menu(nome_conta)
}

//checando se a conta da trasnferencia existe
function checando_conta(conta_da_transferencia){
    if(!fs.existsSync(`accounts/${conta_da_transferencia}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe, tente novamente!'))
        return true
    }

    return false
}